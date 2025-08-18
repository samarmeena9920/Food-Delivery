import './VideoHero.css'

const VideoHero = () => {
  return (
    <div className='video-hero'>
      <video 
        className='video-hero-video'
        autoPlay 
        muted 
        loop
        playsInline
      >
        <source src="/video/MAIN.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className='video-hero-overlay'>
        <div className='video-hero-content'>
          {/* <h2>Order your favourite food here</h2> */}
        </div>
      </div>
    </div>
  )
}

export default VideoHero
