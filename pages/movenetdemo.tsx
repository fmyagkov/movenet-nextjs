//React imports
import React from 'react'
import { useRef, useState, useEffect } from 'react'

//Tensorflow imports
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

//React webcam imports
import Webcam from 'react-webcam'

//Material UI imports
import { Button } from '@material-tailwind/react'

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

  // state looking after intervalId
  const [intervalId, setIntervalId]: any = useState(null)

  // Main function
  const runPoseDetection = async () => {
    // Load the Movenet model
    const net = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        // modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        enableSmoothing: true,
      }
    )

    //  Loop and detect keypoints on the body
    const newIntervalId = setInterval(() => {
      void detect(net)
    }, 10)
    setIntervalId(newIntervalId)
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
    // Get coordinate for left hip from the keypoints array
    const leftHip = keypoints[11]
    const leftHipY = leftHip.y

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw a horizontal line at y=25
    ctx.beginPath()
    ctx.moveTo(0, 40)
    ctx.lineTo(ctx.canvas.width, 40)
    ctx.strokeStyle = 'magenta'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw text next to the line
    ctx.font = '14px Arial'
    ctx.fillStyle = 'magenta'
    ctx.fillText('Shoulder Position at Start', 200, 58)

    // Draw a horizontal line at y=430
    ctx.beginPath()
    ctx.moveTo(0, 430)
    ctx.lineTo(ctx.canvas.width, 430)
    ctx.strokeStyle = 'magenta'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw text next to the line
    ctx.font = '14px Arial'
    ctx.fillStyle = 'magenta'
    ctx.fillText('Knee Position at Start', 200, 425)

    // Set our min confidence score needed to render a keypoint
    const minPartConfidence = 0.4

    // Render all keypoints
    keypoints.forEach((keypoint: any) => {
      const { y, x, score } = keypoint
      if (score > minPartConfidence) {
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'aqua'
        ctx.fill()
      }
    })

    if (leftHip.score > minPartConfidence) {
      // Add left hip y to array
      leftHipArrayTemp.push(leftHipY)

      // Only keep the last 10 values in the array
      if (leftHipArrayTemp.length > 10) {
        leftHipArrayTemp.shift()
      }

      // Check if a squat has just happened
      if (
        leftHipArrayTemp.slice(-1) < 300 &&
        leftHipArrayTemp.slice(-2, -1) > 300
      ) {
        squatCountTemp.push(1)
      }

      // Set squat state and hip y coord state in order to render them
      setSquatCount(squatCountTemp.length)
      setleftHipYCoordinate(leftHipY)
    }
  }

  function startPoseDetection() {
    if (intervalId === null) {
      void runPoseDetection()
    } else {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Button onClick={startPoseDetection} className="m-5">
        {intervalId === null ? 'Start' : 'Stop'}
      </Button>
      <div className="flex-grow flex flex-col items-center space-y-2">
        <div className="relative webcam-container">
          <Webcam ref={webcamRef} className="webcam" />
          <canvas ref={canvasRef} className="canvas-overlay" />
        </div>
        <div className="flex space-x-2">
          <div className="border border-black flex flex-col items-center justify-center w-20 h-40">
            <h1 className="font-semibold">Reps</h1>
            <div className="font-bold">{squatCount}</div>
          </div>
          <BarChart recievedData={leftHipYCoordinate} />
        </div>
      </div>
    </div>
  )
}
