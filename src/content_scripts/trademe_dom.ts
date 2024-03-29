import {Target} from "./target";

function extractRootElementFrom(element: HTMLElement): HTMLElement {
  if (!element) {
    return null;
  } else if (Array.from(element.classList).some(className => /card__wrapper$/.test(className))) {
    return element;
  } else {
    return extractRootElementFrom(element.parentElement);
  }
}

function extractTargetFromLink(link: HTMLLinkElement): Target {
  return {
    id: link.href.match("/listing/(\\d+)")[1],
    rootElement: extractRootElementFrom(link)
  };
}

function raiseTargetError(s: string, target: Target): void {
  console.error(s, target);
  throw "invalid target was found -- check the DOM!";
}

function validateTargets(targets: Array<Target>): void {
  const ids = {};
  targets.forEach(target => {
    if (!target.id) {
      raiseTargetError("target without id", target);
    }
    if (!target.rootElement) {
      raiseTargetError("target without wrapper", target);
    }
    if (ids[target.id]) {
      raiseTargetError("duplicate target", target);
    }
    ids[target.id] = true;
  });
}

function getWrapperListTargets(): Array<Target> {
  const searchLinkElements = document.getElementsByClassName("tm-property-search-card__link");
  const searchPremiumLinkElements = document.getElementsByClassName("tm-property-premium-listing-card__link");
  const watchlistLinkElements = document.getElementsByClassName("tm-property-watchlist-card__link");
  const allLinkElements = Array.from([
    ...searchLinkElements,
    ...searchPremiumLinkElements,
    ...watchlistLinkElements
  ]);
  return allLinkElements.map(extractTargetFromLink);
}

function getWrapperPageTarget(): Array<Target> {
  const pageTest = (/listing\/\d+$/.test(window.location.pathname));
  const photosElement = document.querySelector<HTMLElement>('tm-gallery-view');
  if (pageTest && photosElement) {
    return [{
      id: window.location.pathname.match(/listing\/(\d+)$/)[1],
      rootElement: photosElement
    }]
  } else {
    return [];
  }
}

function getWrapperTargets(): Array<Target> {
  const allTargets = [
    ...getWrapperListTargets(),
    ...getWrapperPageTarget()
  ];
  validateTargets(allTargets);
  return allTargets;
}

export {getWrapperTargets}
