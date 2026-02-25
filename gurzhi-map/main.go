package main

import (
	"fmt"
	"math/rand"
	"sync"
	"sync/atomic"
	"time"
)

// Traditional map with mutex - dispersive flow
type DispersiveMap struct {
	mu   sync.RWMutex
	data map[string]int
}

func NewDispersiveMap() *DispersiveMap {
	return &DispersiveMap{
		data: make(map[string]int),
	}
}

func (m *DispersiveMap) Set(key string, val int) {
	m.mu.Lock()
	m.data[key] = val
	m.mu.Unlock()
}

func (m *DispersiveMap) Get(key string) (int, bool) {
	m.mu.RLock()
	val, ok := m.data[key]
	m.mu.RUnlock()
	return val, ok
}

// Gurzhi map - momentum-conserving flow
// Operations create "channels" that persist briefly, allowing batched operations
type GurzhiMap struct {
	data map[string]int
	ops  chan func()
	done chan struct{}
}

func NewGurzhiMap() *GurzhiMap {
	m := &GurzhiMap{
		data: make(map[string]int),
		ops:  make(chan func(), 100), // buffered channel = flow capacity
		done: make(chan struct{}),
	}
	go m.run()
	return m
}

func (m *GurzhiMap) run() {
	// The flow engine - operations conserve momentum through batching
	batch := make([]func(), 0, 10)
	ticker := time.NewTicker(100 * time.Microsecond)
	defer ticker.Stop()

	for {
		select {
		case op := <-m.ops:
			// Accumulate operations (conserve momentum)
			batch = append(batch, op)
			
			// When flow is hot (more ops incoming), drain faster
			if len(m.ops) > 50 {
				// High heat = high flow rate (Gurzhi effect!)
				for len(batch) > 0 && len(batch) < 20 {
					select {
					case op := <-m.ops:
						batch = append(batch, op)
					default:
						goto executeBatch
					}
				}
			}
			
		executeBatch:
			// Execute the batch - single traversal through the data structure
			for _, op := range batch {
				op()
			}
			batch = batch[:0] // reset but keep capacity
			
		case <-ticker.C:
			// Periodic flush for low-heat scenarios
			for _, op := range batch {
				op()
			}
			batch = batch[:0]
			
		case <-m.done:
			return
		}
	}
}

func (m *GurzhiMap) Set(key string, val int) {
	done := make(chan struct{})
	m.ops <- func() {
		m.data[key] = val
		close(done)
	}
	<-done
}

func (m *GurzhiMap) Get(key string) (int, bool) {
	done := make(chan struct {
		val int
		ok  bool
	})
	m.ops <- func() {
		val, ok := m.data[key]
		done <- struct {
			val int
			ok  bool
		}{val, ok}
	}
	result := <-done
	return result.val, result.ok
}

func (m *GurzhiMap) Close() {
	close(m.done)
}

// Benchmark runner
func benchmark(name string, workers int, opsPerWorker int, mapType string) time.Duration {
	var m interface {
		Set(string, int)
		Get(string) (int, bool)
	}
	
	if mapType == "dispersive" {
		m = NewDispersiveMap()
	} else {
		gm := NewGurzhiMap()
		defer gm.Close()
		m = gm
	}
	
	var wg sync.WaitGroup
	var opsCompleted atomic.Int64
	
	start := time.Now()
	
	// Spawn workers
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			r := rand.New(rand.NewSource(time.Now().UnixNano()))
			
			for j := 0; j < opsPerWorker; j++ {
				key := fmt.Sprintf("key-%d", r.Intn(100))
				
				if r.Intn(2) == 0 {
					m.Set(key, workerID)
				} else {
					m.Get(key)
				}
				opsCompleted.Add(1)
			}
		}(i)
	}
	
	wg.Wait()
	elapsed := time.Since(start)
	
	totalOps := opsCompleted.Load()
	opsPerSec := float64(totalOps) / elapsed.Seconds()
	
	fmt.Printf("%s | Workers: %2d | Ops: %d | Time: %s | Ops/sec: %.0f\n",
		name, workers, totalOps, elapsed.Round(time.Millisecond), opsPerSec)
	
	return elapsed
}

func main() {
	fmt.Println("=== Dispersive vs. Gurzhi Map Benchmark ===\n")
	fmt.Println("Dispersive = traditional mutex lock (operations lose momentum)")
	fmt.Println("Gurzhi = channel-based batching (operations conserve momentum)")
	fmt.Println()
	
	opsPerWorker := 1000
	
	for workers := 1; workers <= 16; workers *= 2 {
		fmt.Printf("\n--- %d Workers ---\n", workers)
		dispersiveTime := benchmark("Dispersive", workers, opsPerWorker, "dispersive")
		gurzhiTime := benchmark("Gurzhi    ", workers, opsPerWorker, "gurzhi")
		
		speedup := float64(dispersiveTime) / float64(gurzhiTime)
		if speedup > 1.0 {
			fmt.Printf("→ Gurzhi is %.2fx FASTER (heat enabled flow!)\n", speedup)
		} else {
			fmt.Printf("→ Dispersive is %.2fx faster (low heat, no advantage)\n", 1.0/speedup)
		}
	}
	
	fmt.Println("\n=== The Gurzhi Effect ===")
	fmt.Println("Watch for the crossover: at low worker counts, dispersive wins (low heat).")
	fmt.Println("At high worker counts, Gurzhi wins (high heat = high flow).")
	fmt.Println("This is the software equivalent of electrons flowing like water.")
}
