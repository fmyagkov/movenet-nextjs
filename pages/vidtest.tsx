/* eslint-disable max-depth */

import React from 'react'
import { useRef, useState, useEffect } from 'react'
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'
import Webcam from 'react-webcam'
import BarChart from '../components/BarChart'
import { detectHelper } from '../utilities/detectHelper'

export default function VideoTest() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [squatCount, setSquatCount] = useState(0)
  const [leftHipAngle, setLeftHipAngle] = useState(0)

  // Main function
  const runPoseDetection = async () => {
    const net = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      }
    )
    //  Loop and detect hands
    setInterval(() => {
      void detect(net)
    }, 10)
  }

  const detect = async (net: poseDetection.PoseDetector) => {
    const keypoints = await detectHelper(net, webcamRef, canvasRef)
    if (keypoints) {
      const ctx = canvasRef.current.getContext('2d')
      countSquats(keypoints, ctx)
    }
  }

  let leftHipArrayTemp: never[] = []
  let squatCountTemp: number[] = []

  const countSquats = (keypoints: any, ctx: any) => {
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

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const minPartConfidence = 0.5
    if (
      leftHip.score > minPartConfidence &&
      rightHip.score > minPartConfidence
    ) {
      // Add left hip y to array
      leftHipArrayTemp.push(leftHipY)
      // Console.log(leftHipArrayTemp);

      if (leftHipArrayTemp.length > 10) {
        leftHipArrayTemp.shift()
      }

      if (
        leftHipArrayTemp.slice(-1) < 200 &&
        leftHipArrayTemp.slice(-2, -1) > 200
      ) {
        squatCountTemp.push(1)
        // E.log(squatCountTemp);
      }

      setSquatCount(squatCountTemp.length)

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

      setLeftHipAngle(leftHipY)
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
        <BarChart recievedData={leftHipAngle} />
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
