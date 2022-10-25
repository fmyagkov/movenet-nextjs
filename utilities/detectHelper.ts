import * as poseDetection from '@tensorflow-models/pose-detection'

export const detectHelper = async (
  net: poseDetection.PoseDetector,
  webcamRef: any,
  canvasRef: any
) => {
  // Check data is available
  if (
    typeof webcamRef.current !== 'undefined' &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  ) {
    // Get Video Properties
    const { video } = webcamRef.current
    const { videoWidth } = webcamRef.current.video
    const { videoHeight } = webcamRef.current.video

    // Set video width
    webcamRef.current.video.width = videoWidth
    webcamRef.current.video.height = videoHeight

    // Set canvas height and width
    canvasRef.current.width = videoWidth
    canvasRef.current.height = videoHeight

    // Make Detections
    const pose = await net.estimatePoses(video)
    if (pose.length > 0) {
      return pose[0].keypoints
    }
  }
}
