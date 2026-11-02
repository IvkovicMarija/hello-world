# Andromeda video: sources for every on-screen claim

Source: **"Meta Andromeda: Powering the Next Generation of Ads Retrieval Through Model-System Co-Design"**, Engineering at Meta, October 28, 2026.
https://engineering.fb.com/2026/10/28/ml-applications/meta-andromeda-next-gen-ads-retrieval-gpu-co-design/

| Scene | On screen | Meta's exact wording |
|---|---|---|
| What is Andromeda? | "Meta's ad retrieval engine. It decides which ads get a shot." · Step 1 Retrieval → Ranking | "Meta Andromeda is Meta's machine learning system for personalized ads retrieval, the first stage of the ads recommendation pipeline. Retrieval narrows a vast pool of eligible ads down to a small set of strong candidates in milliseconds; a later, more computationally expensive ranking stage then scores those survivors in fine detail." |
| Before | "The first filter used a simpler model." · "Ranking-level AI was too costly here" | "Historically, the deep modeling quality of the ranking stage has been too costly to apply at retrieval's scale." |
| Now | "Smarter AI scores every eligible ad." · **1,000,000,000+** ads per second · 100x the 2024 system | "In production, the system scores every eligible ad with near ranking-level model performance at retrieval scale and surfaces the top candidates at over one billion ads per second, a new throughput benchmark for ads retrieval-stage models (i.e., a 100x lift compared to the 2024 Meta Andromeda system)." |
| Matches | "Same speed. Bigger pool. Better matches." | "For advertisers, this means better performance automatically from the retrieval system matching ads across a larger candidate pool, within the same latency budget." · "For advertisers, it means better customer matches and more conversions." |
| Matches | **2.4%** more conversions on Facebook since 2025 | "Since 2025, Meta Andromeda has delivered a 2.4% increase in conversions on Facebook." |

**Not from Meta (Marija's practitioner takeaway):** the last three scenes, "Your creative is the new targeting", "Different ads open more doors" and the checklist, are advice drawn from the article. They are not claims Meta makes. The closest supporting lines are "generative AI creative tools have helped advertisers rapidly create hundreds of millions of new ads, growing Meta's ads candidate pool to an unprecedented scale" and, for the Andromeda model itself, "Ad content fused with real-time serving context forms a contextualized ad input". The "Auction" step label is general Meta ads knowledge and doesn't come from this article.
