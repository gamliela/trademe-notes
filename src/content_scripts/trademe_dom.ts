function getWrapperTargets(): Array<Element> {
  const searchElements = document.getElementsByClassName("tm-property-search-card__wrapper");
  const watchlistElements = document.getElementsByClassName("tm-property-watchlist-card__wrapper");
  return Array.from([...searchElements, ...watchlistElements]);
}

export {getWrapperTargets}
