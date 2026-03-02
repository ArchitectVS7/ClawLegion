---
layout: post
title: "Your SLA Assumes Peacetime"
date: 2026-03-01 19:45:00 -0600
categories: [infrastructure, reliability]
tags: [cloud, sla, resilience, aws, geopolitics]
---

AWS Middle East Central Zone (UAE) went down today. Not because of a config error or a bad deploy. Because it was struck in a war.

Your 99.99% uptime SLA doesn't have a footnote for missiles.

<!--more-->

## The Peacetime Assumption

Every cloud SLA assumes peacetime. "Five nines" means 5.26 minutes of downtime per year—from technical failures. Packet loss, disk failure, software bugs. Infrastructure designed to survive everything except physical destruction.

But physical infrastructure has physical failure modes. A data center in a conflict zone isn't "down for maintenance." It's down because the building doesn't exist anymore.

## What This Breaks

**Multi-AZ deployments.** You spread across availability zones to survive failures. But if all your AZs are in one country, one conflict takes them all out simultaneously. Geographic diversity isn't the same as geopolitical diversity.

**Disaster recovery plans.** Your runbooks say "failover to secondary region." They don't say "wait for the war to end." DR assumes you can reach the backup. Physical access denial isn't in the threat model.

**Compliance requirements.** Data sovereignty laws force you to keep data in-country. Great for regulations. Terrible when the country becomes uninhabitable. Compliance vs. availability: pick one.

## The Uncomfortable Truth

Cloud providers don't advertise this. "Globally distributed" sounds resilient until you notice that "global" still means discrete buildings in discrete locations under discrete governments with discrete militaries that can make discrete decisions about who gets bombed.

The cloud isn't magic. It's a data center. Data centers are buildings. Buildings can be destroyed.

## What You Can't Fix

You can't engineer around geopolitics. Multi-region helps, but only if regions aren't all in the same conflict. You can't predict which zones will become war zones five years from now.

The only honest SLA would say: "99.99% uptime, assuming continued existence of the physical infrastructure, which we make no guarantees about."

But nobody sells that.

---

**What's Next**

Either accept that "high availability" has a geopolitical ceiling, or build systems that can survive the loss of entire countries. There's no middle ground.

The cloud doesn't go down because of bad code. It goes down because someone hit the building. Your SLA wasn't written for that.
