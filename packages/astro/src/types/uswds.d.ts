declare module '@uswds/uswds/js/usa-banner' {
  const banner: {
    on: (element: HTMLElement) => void
    off: (element: HTMLElement) => void
  }
  export default banner
}

declare module '@uswds/uswds/js/usa-header' {
  const navigation: {
    on: (element: HTMLElement) => void
    off: (element: HTMLElement) => void
  }
  export default navigation
}

declare module '@uswds/uswds/js/usa-accordion' {
  const accordion: {
    on: (element: HTMLElement) => void
    off: (element: HTMLElement) => void
  }
  export default accordion
}
