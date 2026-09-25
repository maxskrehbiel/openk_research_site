// Published OpenK articles. Article text is (c) Maxwell Krehbiel, all rights reserved; see README.
export type ArticleKind = "thesis" | "note" | "program";
export type ArticleSection = { heading: string; body: string[] };
export type ArticleRef = { authors: string; year: number; title: string; venue: string };
export type Article = {
  slug: string;
  kind: ArticleKind;
  title: string;
  dek: string;
  classification: string;
  readingMinutes: number;
  sections: ArticleSection[];
  keyTakeaways?: string[];
  related?: string[];
  references?: ArticleRef[];
  draft?: boolean;
};

export const articles: Article[] = [
  {
    slug: "the-k-curve",
    kind: "thesis",
    title: "The K Curve: Where Noise Gives Way to Structure",
    dek: "Short-term prices are close to random; long-run outcomes are not. The K curve is OpenK's moving reference for understanding how noise gradually gives way to structure as time expands.",
    classification: "Worldview",
    readingMinutes: 7,
    keyTakeaways: [
      "Short-term price changes in a broad index are close to random because they are dominated by information that does not exist yet. That is a premise, not an obstacle.",
      "Long-run outcomes are far more structured because most information is temporary and washes out while a slower reference persists.",
      "The K curve is that reference: a moving, multi-horizon structure. It is not a fixed average, a target price, or a forecast.",
      "Its closest published relative is the Heterogeneous Autoregressive model of Corsi. OpenK adapts that multi-horizon principle to a different question, and the construction stays private.",
      "Predictability is a function of horizon. The short run is a problem of unknown information; the long run is a problem of structural continuity.",
    ],
    sections: [
      {
        heading: "Two truths that only look like a contradiction",
        body: [
          "Two things are true about markets at the same time, and they sound like they cannot both be. The first is that the next move in a broad index is close to random price action. The second is that long-run outcomes contain structure that short-term price changes do not. Most people pick one and dismiss the other. The work that matters lives in holding both.",
          "They reconcile the moment you separate them by time. In the short run, new information dominates. Over long horizons, the temporary part of every move has more time to fade, and cumulative outcomes track a slower structure more closely. The randomness is real up close. The pull toward the law of averages is real from far away. Time is what tells them apart.",
          "This piece defines that slower structure, which I call the K curve. It explains what the curve measures, where the idea comes from, and why our ability to say anything useful about a market changes continuously with the horizon we care about. It is the main entrance to how OpenK thinks.",
        ],
      },
      {
        heading: "Why the short run is close to random",
        body: [
          "The random walk is not just a claim that prices are meaningless. It is a claim about information. Tomorrow's move depends on information that does not exist yet, or that exists but has not yet been interpreted in the way it will be tomorrow. By the time new information is widely known and understood, much of its effect is already reflected in the price.",
          "Even knowing the news in advance may not be enough. A weak economic report can cause the market to rise because investors expect interest rates to fall. Strong earnings can cause a stock to decline because the result failed to clear an even higher expectation. The reaction depends not only on the information itself, but on what was already priced, how investors were positioned, and which interpretation wins.",
          "So when I say the short run is close to random, I mean it in the strong sense. The problem is not that the tools are immature. The thing being predicted is dominated by the unknowable. Any honest framework starts by conceding how much of the short run is out of reach and is then built to work anyway.",
        ],
      },
      {
        heading: "Irrationality does not hand you the short run",
        body: [
          "It is tempting to think that if markets overreact, the overreaction is easy money. It is not. Irrational reactions are themselves unpredictable. Knowing the market will sometimes overweight a fresh headline tells you nothing about which headline, in which direction, by how much, or for how long.",
          "Recognizing that a crowd is fearful is not the same as knowing when the fear peaks. A market can look obviously expensive and keep rising for years. It can look washed out and still fall much further. Short-term mispricing can be real and still be untradeable in advance because the timing and size of the correction are set by an interpretation shift that no one schedules.",
          "This is why turning points look much cleaner in retrospect than they ever did in real time. Once a trend breaks, everyone can identify the leverage, the speculation, the stretched assumptions, and the warning signs. Before it breaks, those same conditions can persist far longer than expected. Being right that the market is wrong is not enough. You also have to know when it will matter, or be able to survive until it does.",
        ],
      },
      {
        heading: "A moving reference, not a fixed average",
        body: [
          "The K curve is a moving anchor. Rather than choosing one look-back window and treating it as the correct one, it draws information from many time scales at once. The result is a slower reference that reflects where the market has been, how its long-run path is changing, and what kind of return that path currently implies.",
          "In any dataset, the average gives you a reference point. If you knew what the market's average return would be in the future, you would know whether the current path was running above or below it. The K curve is my attempt to estimate that future average as it moves.",
          "It is not a fixed average. It is not a fair-value line, a target price, or a deterministic forecast, and it is not a moving average, which is only a smoothed summary of past prices. The distinction that matters most is between a fixed reference and a moving one. A fixed reference assumes some constant level, or constant rate, that prices eventually snap back to. The K curve assumes the opposite: the anchor itself is alive.",
          "It bends as the market and the economy change around it. That is important because the long-run return of a market is not fixed. Productivity changes, valuations change, financial conditions change, and the productive structure of the economy changes. A useful anchor has to move with them.",
        ],
      },
      {
        heading: "A market operating on many clocks",
        body: [
          "There is no single correct time scale for understanding a market. A trader, a pension fund, a corporate treasurer, and an individual investor can look at the same price and see entirely different things. Their decisions are made across different horizons, but they all meet in the same market.",
          "Most models choose one clock in advance. They look at a particular trend, return period, or moving average and assume that window contains the relevant information. The K curve does not. It combines the market's behavior across many horizons into one moving anchor. No single horizon tells the whole story.",
        ],
      },
      {
        heading: "How the anchor becomes useful",
        body: [
          "The K curve takes the market's historical return structure and projects that anchor forward. Current prices can then be viewed relative to the return path implied by the market's own history.",
          "That does not produce one inevitable future. It creates a reference against which future outcomes can be studied. When price moves far away from the anchor, the range and probability of future returns may change. When price remains close to it, the market may behave differently.",
          "The K curve is therefore not the prediction by itself. It is the anchor that makes prediction possible.",
        ],
      },
      {
        heading: "Where the K curve comes from",
        body: [
          "Good ideas rarely arrive from nowhere, and this one has a clear lineage. The K curve's closest relative in the published literature is the Heterogeneous Autoregressive model of Corsi, which formalized the idea that markets should be studied across multiple time horizons. Corsi used that principle to model volatility. The K curve applies it to a different question: estimating the market's moving anchor return.",
          "Credibility in this work comes from being honest about what is borrowed and what is new. The multi-horizon idea is borrowed and battle-tested. What is new is the turn from that idea into a moving reference, and the role that reference plays inside a forward distribution.",
        ],
      },
      {
        heading: "Why most information is temporary",
        body: [
          "The claim that markets are more structured over long horizons rests on a claim about information: at the level of a broad index, the overwhelming majority of daily information is temporarily impactful on price. It moves expectations, liquidity, or fear without permanently changing what the economy can produce.",
          "That is a high bar, and it needs to be. For information to leave a lasting mark on the index, it has to alter the productive structure itself: the stock of capital, the direction of technology, the capacity to generate output over time. Most news does not do that. It moves sentiment and financing conditions, and those fade as the next quarter and the next cycle arrive.",
          "Markets and the economy still operate as a two-way loop, which is why temporary shocks can create real consequences without permanently changing the slower structure beneath them.",
        ],
      },
      {
        heading: "Predictability is a function of horizon",
        body: [
          "If most information is temporary and the reference moves, then predictability is not a fixed property of markets. It changes continuously with the horizon you care about. Near the front, uncertainty is mostly about unknown information. Far out, it is mostly about whether the structure holds. Those are two different problems, and conflating them is a shortsighted mistake.",
        ],
      },
    ],
    draft: false,
    references: [
      {
        authors: "Corsi, F.",
        year: 2009,
        title: "A Simple Approximate Long-Memory Model of Realized Volatility",
        venue: "Journal of Financial Econometrics",
      },
    ],
  },
  {
    slug: "where-we-are-and-how-we-got-here",
    kind: "note",
    title: "Where We Are and How We Got Here",
    dek: "A price is a coordinate, not a description. What gives it meaning is where the market sits and the road it traveled to get there. OpenK is built to read both from price alone.",
    classification: "Concept explainer",
    readingMinutes: 7,
    sections: [
      {
        heading: "A price is a coordinate, not a description",
        body: [
          "Tell me the market is at a certain level and you have given me the start of a question, not an answer. A price is a single number. It tells you where the market is standing. It says almost nothing about the situation the market is standing in.",
          "Picture two markets at exactly the same level. One arrived after a long, patient climb, with fear low and optimism widening. The other arrived days after a violent drop, with prices still shaking and investors braced for further loss. Same number, opposite circumstances. Read only the current price and the two markets look identical, so you treat them the same. They are not the same at all.",
          "This is the problem I set out to solve. I could see context that the raw price was hiding, and OpenK began as an attempt to show a computer what I was seeing. Two ideas do most of the work. I call them STATE and PATH.",
        ],
      },
      {
        heading: "STATE: where the market sits",
        body: [
          "STATE is the market's position relative to its own history. Not relative to one average, one target price, or one long-run return, because a single anchor is too thin a reference. STATE measures the current level against many historical anchors at once, along with the distributions of where the market has been before.",
          "The question is never simply whether today's price is high or low. It is high or low compared to what, and how unusual is that position? A level that looks ordinary against one stretch of history may look extreme against another. By reading position across several references instead of one, STATE captures whether the market sits somewhere familiar or somewhere it has rarely been.",
          "Be clear about what this means. STATE describes position. It is not a prediction and it is not a timing signal. Knowing the market sits in an unusual place tells you something about vulnerability and how much room there is for expectations to change. It does not tell you when they will change. Overvaluation can persist for a long time. Valuation marks vulnerability, not timing, and that distinction runs through everything I do.",
        ],
      },
      {
        heading: "PATH: how the market got here",
        body: [
          "PATH is the second idea, and the one most people underrate. PATH is the road the market traveled to reach its current state. The same endpoint can be reached in many ways, and the way matters.",
          "A sudden crash and a gradual decline can finish at an identical price. The crash carries the signature of fear arriving quickly, forced selling, and dislocation. The slow decline carries the signature of confidence draining out over time. These are different states of the world wearing the same price tag. Investors inside them feel different things, hold different positions, and may react differently to whatever comes next.",
          "Fear and optimism run through the entire cycle, not only at its turning points, and PATH is where much of that history remains visible. I am not searching for a chart from the past that looks exactly like the present. History does not repeat that cleanly. I am reading the character of the journey: whether the move was a sharp break or a long grind, whether it is accelerating or exhausting itself, and whether instability arrived suddenly or accumulated over time.",
          "The journey is information. Price throws most of it away the moment you reduce the market to one current number.",
        ],
      },
      {
        heading: "The published evidence that path matters",
        body: [
          'This is not a hunch I am asking anyone to accept on faith. Guyon and Lekeufack, in "Volatility Is (Mostly) Path-Dependent," show that volatility depends heavily on the path the market followed, not only its current position. Their work provides strong published evidence for the broader premise that the road matters, not just the destination.',
          "Their research anchors that premise. Where OpenK differs is in scope and intent. They study path dependence in volatility. I am after a broader description of the market: where it sits, how it arrived, and what those two things reveal about fear, optimism, vulnerability, and the changing range of future outcomes.",
          "The underlying intuition is in the published record. OpenK extends that intuition beyond volatility, builds its own descriptions of STATE and PATH from price, and keeps the exact construction private.",
        ],
      },
      {
        heading: "Many memories at once",
        body: [
          "Context does not live at one time horizon. Recent motion and structural position are different questions, and answering both requires more than one memory length.",
          "Short memory captures recent motion. It is sensitive to the character of the current move and to fear or optimism as they change. Long memory captures structural position. It moves more slowly, ignores much of the daily noise, and shows where the market sits relative to its deeper history.",
          "Neither is complete alone. A market can appear calm in short memory while sitting at an extreme in long memory. It can move violently in the short run while remaining close to its longer structure. Both descriptions can be true at the same time.",
          "OpenK therefore reads the market through several memory lengths together. No single window can keep the recent and the structural in view at once.",
          "This also helps keep the K curve, OpenK's moving anchor, connected to the changing market around it. The K curve and the economic loop receive their own treatment elsewhere. The point here is simpler: context changes depending on how far back you look, so the model has to remember more than one version of the past.",
        ],
      },
      {
        heading: "Price as a compressed record",
        body: [
          "Everything described here is built from price alone, with no direct macroeconomic inputs by design.",
          "The working hypothesis is that price history is already a compressed record of the cycle. Growth, liquidity, fear, leverage, expectations, and financial conditions all leave traces in the path investors create. OpenK asks whether enough of that context can be recovered from price itself if the market is described in the right way.",
          "This is not a claim that price contains everything. It is a research choice. Before adding more variables, I want to know how much of the market's condition can be reconstructed from the one record every participant has already helped create.",
        ],
      },
      {
        heading: "Where the interesting question lives",
        body: [
          "The most interesting part is not simply whether price is above or below its structure. It is whether the relationship between the two changes depending on how the market got there.",
          "That relationship appears asymmetric. The downside is often faster, more violent, and more distorted than the upside. After a crash, the market can remain far below its slower structure even as the conditions for recovery begin to form. Near the top, vulnerability may build gradually and remain hidden until expectations finally break.",
          "OpenK studies whether those differences can be read from price early enough to matter.",
          "This work remains in live testing. The question is not whether STATE and PATH can describe the past convincingly. Flexible models can almost always do that. The question is whether they contain information about the future that simpler descriptions miss.",
        ],
      },
      {
        heading: "Concept public, construction private",
        body: [
          "I am open about the concept because the concept is the honest part, and I want it examined.",
          "STATE is where the market sits relative to its own history. PATH is the journey that produced that position. Multiple memory lengths keep the recent and the structural in view at the same time.",
          "What stays private is the construction: how the references are defined, how memory lengths are selected and combined, how the path is represented, and how those descriptions are turned into something a model can use.",
          "The idea is public on purpose. The implementation is the work, and the work is where the value lives.",
        ],
      },
    ],
    keyTakeaways: [
      "A price is a coordinate, not a description. Two markets at the same level can exist in completely different circumstances.",
      "STATE describes where the market sits relative to several historical references and prior distributions.",
      "PATH describes how the market arrived. A sudden crash and a slow decline can end at the same price while carrying very different information.",
      "Guyon and Lekeufack provide published evidence that volatility is strongly path-dependent. OpenK extends the broader intuition that the road matters beyond volatility.",
      "Valuation marks vulnerability, not timing. An unusual position can persist until something changes the prevailing interpretation.",
      "Context exists across memory lengths, so OpenK reads the recent and the structural together.",
      "The concept is public. The exact construction remains private.",
    ],
    related: ["the-k-curve", "forward-distributions"],
    draft: false,
    references: [
      {
        authors: "Guyon, J., & Lekeufack, J.",
        year: 2023,
        title: "Volatility Is (Mostly) Path-Dependent",
        venue: "Quantitative Finance",
      },
    ],
  },
  {
    slug: "forward-distributions",
    kind: "program",
    title: "OpenK Forward Distributions",
    dek: "Forward Distributions is the flagship of OpenK: using price alone, I read where a market sits in its own history and how it got there to sharpen the full range of returns that may follow.",
    classification: "Active research",
    readingMinutes: 7,
    sections: [
      {
        heading: "The question",
        body: [
          "Forward Distributions is the flagship of OpenK, and the question behind it is narrow on purpose:",
          "Using price data alone, do a market's historical state and path sharpen the forward-return distribution beyond what simple baselines already deliver?",
          "Every part of that question carries weight. State and path mean where the market sits and how it arrived. The forward-return distribution is the full range of what has tended to happen next in the real world, not the option-implied distribution priced for hedging. Baselines mean I hold the work against honest, simple alternatives. Price alone means exactly that: no direct macroeconomic inputs.",
          "The premise is that price history is already a compressed record of the cycle, and that the structure I care about can be recovered from price itself if it is described correctly.",
        ],
      },
      {
        heading: "Why a single price is not enough",
        body: [
          "A price tells you what one instrument costs right now. It does not tell you where that price sits against the market's own history, whether it arrived through a slow climb or a violent drop, or how that context shaped the outcomes that followed.",
          "Markets and the economy operate as a two-way loop. Over shorter windows, investors can overweight the current event and underweight the history around it. Fear and optimism run through the entire cycle, not only at its extremes.",
          "Forward Distributions puts that missing context back in. Instead of asking only what the price is, I ask a fuller question:",
          "Given where the market sits relative to its own past, and given the path it took to get here, what has the full distribution of future returns tended to look like?",
        ],
      },
      {
        heading: "How I represent state and path",
        body: [
          "STATE describes where the market sits relative to its own history. It is measured across several memory lengths rather than against one fixed anchor. A single moving average or look-back period may be informative, but it forces one version of memory onto every part of the cycle. Reading across several memories allows recent context and structural context to exist at the same time.",
          "The K curve, OpenK's moving long-run reference, plays an important role in that description. It provides an anchor that can change with the market rather than assuming that one historical average remains correct forever.",
          "PATH describes how the market reached its current position. It captures the shape, speed, and character of the journey rather than only the endpoint. Two markets can sit at the same level after arriving in completely different ways, and those different paths may carry different information about what follows.",
          "STATE says where the market is. PATH says how it got there. Both are read from price, and the internal construction remains private.",
        ],
      },
      {
        heading: "What the model outputs",
        body: [
          "The output is not one number. It is a distribution.",
          "For a given horizon, the model describes the full shape of forward returns: the center, the width of the range, the balance between upside and downside, and the odds of the large moves that matter most.",
          "It does this across several horizons because the context that matters over one month may not be the context that matters over several years. Predictability changes with time, so the forecast has to change with it.",
          "A point estimate hides the two things an investor most needs to understand: how uncertain the estimate is and how severe the downside could be. Two markets can have the same expected return while carrying completely different risks.",
          "A heavy left tail marks vulnerability, not timing. It says the market is fragile. It does not say the market will turn tomorrow.",
          "The distortion is also asymmetric. It is often most visible in the downside before or during stress, and in the upside distribution after a crash. A separate OpenK program on fear and promise develops that asymmetry in full.",
        ],
      },
      {
        heading: "The published lineage",
        body: [
          "The pieces behind this program are published, and I name them because they are both the lineage and the standard OpenK measures itself against.",
          "Corsi showed that volatility is best understood across several time horizons at once. That multi-horizon principle is central to how OpenK represents market state. Guyon and Lekeufack demonstrated that volatility is strongly path-dependent, providing published evidence that the road a market traveled contains information beyond its current position.",
          "Other research supports modeling the full shape of future returns rather than only the average. Amaya, Christoffersen, Jacobs, and Vasquez showed that realized skewness contains information about future equity returns. Harvey and Siddique established that conditional skewness is priced in the cross-section. Kelly and Jiang showed that tail risk is both time-varying and priced in asset markets.",
          "Those papers establish separate parts of the problem: multiple time horizons, path dependence, skewness, and tail risk. OpenK asks what happens when those pieces are brought together in one physical forward distribution, read entirely from price and anchored to a moving long-run reference.",
          "The published ideas are the foundation. The synthesis is mine.",
        ],
      },
      {
        heading: "How I test it honestly",
        body: [
          "A method that quietly uses future information is worthless, and most of the ways to fool yourself are subtle. The validation design is therefore strict.",
          "The data is divided chronologically into training, validation, embargo, and test periods. It is never randomly shuffled. The embargo is a deliberate gap that prevents overlapping future returns from leaking information across the boundaries.",
          "Every transformation is prior-only, meaning it is calculated using only the information that would have been available at the historical decision time. Nothing is normalized using statistics drawn from the future.",
          "Every result is also measured against simple baselines. Better than nothing is not the standard. Better than the plausible alternative is.",
        ],
      },
      {
        heading: "What holds up, and what stays hard",
        body: [
          "The results are not uniform, and they should not be.",
          "The value of STATE and PATH changes with the horizon and the condition of the market. There are places where the added context sharpens the forward distribution beyond the baselines, and there are places where the simpler approach is genuinely as good. I treat both as findings.",
          "The program fails if the added context cannot improve out-of-sample forecasts beyond those simpler alternatives, or if the apparent advantage disappears under chronological testing.",
          "The downside tail remains the hardest part of the distribution to forecast well. It is also the region investors care about most. Crashes are rare, their causes differ, and the limited number of examples makes the left tail especially easy to overfit.",
          "That is the honest frontier of the work. The places where added context does not help are as informative as the places where it does.",
        ],
      },
      {
        heading: "Limitations and status",
        body: [
          "The limitations are real.",
          "Markets are nonstationary, so the relationships learned from the past can shift. The crash periods that dominate downside risk are scarce. The work currently focuses on broad indexes, so its conclusions should not automatically be extended to individual securities or other markets.",
          "An improved distribution is also a sharper map, not a strategy. There is no automatic path from a better forecast to a profitable trade. Position sizing, execution, costs, timing, and risk management remain separate problems.",
          "Status: Forward Distributions is the OpenK flagship and is currently in live testing. The published foundations are strong, but the value of the program will be determined by what survives honest out-of-sample comparison.",
          "The parts that resist testing are teaching me as much as the parts that hold.",
        ],
      },
    ],
    keyTakeaways: [
      "A single price is context-free. Where a market sits relative to its own history, and the path it took to get there, may contain information that the current price alone throws away.",
      "The output is a full distribution across horizons, not a point forecast. It describes the center, the width, the asymmetry, and the tail odds.",
      "The building blocks are published. Multi-horizon state, path-dependent volatility, realized skewness, and time-varying tail risk are established research areas.",
      "OpenK combines those ideas into one physical forward view, read from price alone and anchored to the K curve.",
      "Validation is chronological, embargoed, prior-only, and measured against simple baselines.",
      "The results are horizon-dependent. Added complexity has to earn its place.",
      "A sharper distribution is a map of opportunity and vulnerability, not a timing signal or an automatic strategy.",
    ],
    related: ["where-we-are-and-how-we-got-here"],
    draft: false,
    references: [
      {
        authors: "Corsi, F.",
        year: 2009,
        title: "A Simple Approximate Long-Memory Model of Realized Volatility",
        venue: "Journal of Financial Econometrics",
      },
      {
        authors: "Guyon, J., & Lekeufack, J.",
        year: 2023,
        title: "Volatility Is (Mostly) Path-Dependent",
        venue: "Quantitative Finance",
      },
      {
        authors: "Amaya, D., Christoffersen, P., Jacobs, K., & Vasquez, A.",
        year: 2015,
        title: "Does Realized Skewness Predict the Cross-Section of Equity Returns?",
        venue: "Journal of Financial Economics",
      },
      {
        authors: "Harvey, C. R., & Siddique, A.",
        year: 2000,
        title: "Conditional Skewness in Asset Pricing Tests",
        venue: "The Journal of Finance",
      },
      {
        authors: "Kelly, B., & Jiang, H.",
        year: 2014,
        title: "Tail Risk and Asset Prices",
        venue: "The Review of Financial Studies",
      },
    ],
  },
];

// Publication gate: in production only finalized (draft === false) articles are visible.
// In development every article renders so drafts can be previewed locally.
const IS_PROD = process.env.NODE_ENV === "production";
export const isPublished = (a: Article) => a.draft === false;
const visible = (a: Article) => !IS_PROD || isPublished(a);
export const publishedArticles = () => articles.filter(visible);
export function getArticle(slug: string): Article | undefined {
  const a = articles.find((x) => x.slug === slug);
  return a && visible(a) ? a : undefined;
}
export const thesisArticles = () => articles.filter((a) => a.kind === "thesis" && visible(a));
export const notes = () => articles.filter((a) => a.kind === "note" && visible(a));
export const programs = () => articles.filter((a) => a.kind === "program" && visible(a));
export const ideasPath = (slug: string) => `/ideas/${slug}`;
export const researchPath = (slug: string) => `/research/${slug}`;
/** Site path of an article: theses live under /ideas, notes and programs under /research. */
export const articlePath = (a: Article) =>
  a.kind === "thesis" ? ideasPath(a.slug) : researchPath(a.slug);
