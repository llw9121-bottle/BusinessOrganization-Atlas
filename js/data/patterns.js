export const businessModelPatterns = {
  unbundled: {
    number: "01",
    title: "Unbundled businesses",
    summary: "Relationship, innovation, and infrastructure work can conflict when they share one operating logic.",
    context: "One company combines customer relationships, product innovation, and infrastructure under one roof.",
    challenge: "Different economics and cultures create trade-offs, slower decisions, and diluted focus.",
    solution: "Separate or protect the three business logics while coordinating their shared dependencies.",
    orgLens: "Often a Divisional Form or assembled hybrid: relationship units, project units, and a shared infrastructure platform.",
    examples: "Private banking and mobile telecommunications.",
    bridgePreset: "unbundled"
  },
  long_tail: {
    number: "02",
    title: "Long Tail",
    summary: "A platform can turn many low-volume niche offers into a viable aggregate business.",
    context: "A few bestsellers or standardized services carry most of the revenue.",
    challenge: "Serving many small niche groups is usually too costly through a traditional operating model.",
    solution: "Use a low-cost platform, flexible production, and strong search or recommendation to aggregate niche demand.",
    orgLens: "A Programmed core can support Project, Professional, or Community edges; the periphery needs protection from one-size-fits-all efficiency controls.",
    examples: "Netflix, eBay, Lulu.com, and LEGO user-designed sets.",
    bridgePreset: "long_tail"
  },
  multi_sided: {
    number: "03",
    title: "Multi-sided platform",
    summary: "Interdependent customer groups create value only when they can meet through the same platform.",
    context: "One customer side is served with a single offer.",
    challenge: "A new group would pay for access to the existing group, but neither side wants to join first.",
    solution: "Facilitate interactions, subsidize the side that is harder to attract, and manage network effects deliberately.",
    orgLens: "No single form fits. Expect a central orchestration unit, semi-autonomous sides, and explicit governance of rules, quality, and subsidies.",
    examples: "Google, Visa, eBay, Microsoft Windows, and game consoles.",
    bridgePreset: "multi_sided"
  },
  free: {
    number: "04",
    title: "FREE / cross-subsidy",
    summary: "A free or inexpensive offer can grow the model when another part of the system covers its cost.",
    context: "A valuable offer is priced too high for many potential users.",
    challenge: "The organization cannot attract the scale or participation needed for the model to work.",
    solution: "Use advertising, freemium, or bait-and-hook economics so paying demand supports a free offer.",
    orgLens: "A paying machine-like core may support a community or project edge; subsidy logic must remain visible in resources, voice, and protection.",
    examples: "Metro, Flickr, Red Hat, Skype, and Gillette.",
    bridgePreset: "free"
  },
  open: {
    number: "05",
    title: "Open model",
    summary: "Creating and capturing value across organizational boundaries can increase innovation and use idle assets.",
    context: "Ideas, research, and intellectual property are developed and exploited almost entirely inside the firm.",
    challenge: "Internal innovation is costly or slow, while valuable knowledge and assets remain unused.",
    solution: "Bring outside ideas in, and license or spin out internal ideas that others can use better.",
    orgLens: "Project and community logic become stronger; boundaries need explicit rules for contribution, ownership, and shared upside.",
    examples: "Procter & Gamble, GlaxoSmithKline patent pools, and InnoCentive.",
    bridgePreset: "open"
  }
};
