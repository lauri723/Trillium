const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--student-website-width') != null && rootStyles.getPropertyValue('--student-website-width') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const websiteWidth = parseFloat(rootStyles.getPropertyValue('--student-website-width'))
  const websiteAspectRatio = parseFloat(rootStyles.getPropertyValue('--student-website-aspect-ratio'))
  const websiteHeight = websiteWidth / websiteAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / websiteAspectRatio,
    imageResizeTargetWidth: websiteWidth,
    imageResizeTargetHeight: websiteHeight
  })
  
  FilePond.parse(document.body)
}