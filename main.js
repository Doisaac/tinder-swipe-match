let desitionThreshold = 75
let isAnimating = false
let pullDeltaX = 0 // distance of the card which is moving

function startDrag(event) {
  if (isAnimating) return

  // get the first element
  const actualCard = event.target.closest('article')
  if (!actualCard) return

  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX

  // listen the mouse and touch movements
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)

  document.addEventListener('touchmove', onMove, { passive: true })
  document.addEventListener('touchend', onEnd, { passive: true })

  function onMove(event) {
    // current position 
    const currentX = event.pageX ?? event.touches[0].pageX
    // the distance between the initial and current position
    pullDeltaX = currentX - startX
    // no distance traveled
    if (pullDeltaX === 0) return
    // change the flag to indicate we are animation
    isAnimating = true
    // calculates te rotation of the card using the distancie
    const deg = pullDeltaX / 14
    // apply the transformation to the card
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
    // changes the cursor to grabbing 
    actualCard.style.cursor = 'grabbing'
    // change opacity while we are swipping
    const opacity = Math.abs(pullDeltaX) / 100
    const isRight = pullDeltaX > 0

    const choiseEl = isRight
      ? actualCard.querySelector('.choise.like')
      : actualCard.querySelector('.choise.nope')

    choiseEl.style.opacity = opacity
    console.log(opacity)
  }

  function onEnd(event) {
    // remove the event listeners
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)

    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)

    // knows if the user took a desition 
    const desitionMade = Math.abs(pullDeltaX) >= desitionThreshold

    if (desitionMade) {
      const goRight = pullDeltaX >= 0

      //Add class acording to the decision 
      actualCard.classList.add(goRight ? 'go-right' : 'go-left')
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove()
      })
    } else {
      actualCard.classList.add('reset')
      actualCard.classList.remove('go-right', 'go-left')
      actualCard.querySelectorAll('.choise').forEach((choise) => {
        choise.style.opacity = 0
      })
    }

    // reset the variables
    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style')
      actualCard.classList.remove('reset')

      pullDeltaX = 0
      isAnimating = false
    })


  }
}


document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })