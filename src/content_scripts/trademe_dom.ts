type Target = {
  id: string,
  rootElement: HTMLElement
}

function extractTargetFromLink(link: HTMLLinkElement) : Target {
  return {
    id: link.href.match("/listing/(\\d+)")[1],
    rootElement: link.parentElement.parentElement
  };
}

function raiseTargetError(s: string, target: Target): void {
  console.error(s, target);
  throw "invalid target was found -- check the DOM!";
}

function validateTargets(targets: Array<Target>): void {
  const ids = {};
  targets.forEach(target => {
    if (!target.id) raiseTargetError("target without id", target);
    if (!target.rootElement) raiseTargetError("target without wrapper", target);
    if (!/card__wrapper$/.test(target.rootElement.className)) raiseTargetError("invalid wrapper", target);
    if (ids[target.id]) raiseTargetError("duplicate target", target);
    ids[target.id] = true;
  });
}

function getWrapperTargets(): Array<Target> {
  const searchLinkElements = document.getElementsByClassName("tm-property-search-card__link");
  const watchlistLinkElements = document.getElementsByClassName("tm-property-watchlist-card__link");
  const allLinkElements = Array.from([...searchLinkElements, ...watchlistLinkElements]);
  const allTargets = allLinkElements.map(extractTargetFromLink);
  validateTargets(allTargets);
  return allTargets;
}

export {Target, getWrapperTargets}
