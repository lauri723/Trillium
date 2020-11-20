const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--schedule-listing-width') != null && rootStyles.getPropertyValue('--schedule-listing-width') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const listingWidth = parseFloat(rootStyles.getPropertyValue('--schedule-listing-width'))
  const listingAspectRatio = parseFloat(rootStyles.getPropertyValue('--schedule-listing-aspect-ratio'))
  const listingHeight = listingWidth / listingAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / listingAspectRatio,
    imageResizeTargetWidth: listingWidth,
    imageResizeTargetHeight: listingHeight
  })
  
  FilePond.parse(document.body)
}