//React imports
import React from 'react'
import { useRef, useState, useEffect } from 'react'

//Tensorflow imports
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

//React webcam imports
import Webcam from 'react-webcam'

//My imports
import BarChart from '../components/BarChart'
import { detectHelper } from '../utilities/detectHelper'

export default function VideoTest() {
  // refs for webcam and canvas
  const webcamRef: any = useRef(null)
  const canvasRef: any = useRef(null)

  // states needed to render squat count and current hip y coordinate
  const [squatCount, setSquatCount] = useState(0)
  const [leftHipYCoordinate, setleftHipYCoordinate] = useState(0)

  // Main function
  const runPoseDetection = async () => {
    // Load the Movenet model
    const net = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      }
    )

    //  Loop and detect keypoints on the body
    setInterval(() => {
      void detect(net)
    }, 10)
  }

  // Detect function
  const detect = async (net: poseDetection.PoseDetector) => {
    // Get keypoints from our detectHelper function
    // This function returns an array of keypoints (x,y values where the keypoints are)
    const keypoints = await detectHelper(net, webcamRef, canvasRef)

    // If there are key points we will render them on the body and count our squats
    if (keypoints) {
      const ctx = canvasRef.current.getContext('2d')
      countSquatsAndRender(keypoints, ctx)
    }
  }

  // this Array will hold the last 10 hip y coordinates to help figure out when a squat is happening
  let leftHipArrayTemp: any = []

  // The number of 1's in this array will be used to determine how many squats have been done
  let squatCountTemp: any = []

  const countSquatsAndRender = (keypoints: any, ctx: any) => {
    // Get all coordinates from the keypoints array
    const leftHip = keypoints[11]
    const rightHip = keypoints[12]
    const leftKnee = keypoints[13]
    const rightKnee = keypoints[14]
    const leftAnkle = keypoints[15]
    const rightAnkle = keypoints[16]

    const leftHipY = leftHip.y
    const rightHipY = rightHip.y
    const leftKneeY = leftKnee.y
    const rightKneeY = rightKnee.y
    const leftAnkleY = leftAnkle.y
    const rightAnkleY = rightAnkle.y

    const leftHipX = leftHip.x
    const rightHipX = rightHip.x
    const leftKneeX = leftKnee.x
    const rightKneeX = rightKnee.x
    const leftAnkleX = leftAnkle.x
    const rightAnkleX = rightAnkle.x

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Set our min confidence score needed to render a keypoint
    const minPartConfidence = 0.3
    if (
      leftHip.score > minPartConfidence &&
      rightHip.score > minPartConfidence
    ) {
      // Add left hip y to array
      leftHipArrayTemp.push(leftHipY)

      // Only keep the last 10 values in the array
      if (leftHipArrayTemp.length > 10) {
        leftHipArrayTemp.shift()
      }

      // Check if a squat has just happened
      if (
        leftHipArrayTemp.slice(-1) < 200 &&
        leftHipArrayTemp.slice(-2, -1) > 200
      ) {
        squatCountTemp.push(1)
      }

      // Set squat state and hip y coord state in order to render them
      setSquatCount(squatCountTemp.length)
      setleftHipYCoordinate(leftHipY)

      // Render the keypoints
      ctx.beginPath()
      ctx.arc(leftHipX, leftHipY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(rightHipX, rightHipY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(leftKneeX, leftKneeY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(rightKneeX, rightKneeY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(leftAnkleX, leftAnkleY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(rightAnkleX, rightAnkleY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()
    }
  }

  useEffect(() => {
    void runPoseDetection()
  }, [])

  return (
    <>
      <div>
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: -1,
            width: 640,
            height: 560,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: -1,
            width: 640,
            height: 560,
          }}
        />
        <BarChart recievedData={leftHipYCoordinate} />
      </div>
      <div
        style={{
          marginTop: 20,
          marginLeft: 20,
        }}
      >
        <h1>Squats: {squatCount}</h1>
      </div>
    </>
  )
}
