import React, { useEffect, TouchEvent } from 'react';
import './App.css';
import CreateBoard from './game/Board';
import Board from './game/Board';
import SceneComponent from './SceneComponent';
import { CameraInputTypes, Color4, DirectionalLight, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Nullable, Scene, Vector3 } from '@babylonjs/core';
import GetMaze from './game/GetMaze';

function App() {

  let box:Nullable<Mesh>;
  let camera:FreeCamera;

  const onSceneReady = (scene:Scene) => {
    scene.clearColor = new Color4(0, 0, 0);

    camera = new FreeCamera("camera1", new Vector3(.1, .1, -10), scene);
    camera.setTarget(Vector3.Zero());
  
    const engine = scene.getEngine();

    var fov = camera.fov;
    var aspectRatio = engine.getAspectRatio(camera);
    var d = camera.position.length();
    var height = 2 * d * Math.tan(fov / 2);
    var width = height * aspectRatio;
  
    var light = new HemisphericLight("light", new Vector3(width/3, height/3, -20), scene);//new DirectionalLight("DirectionalLight", new Vector3(1, 1, 100), scene);
    light.intensity = 0.55;


    const board = Board.GenerateRandomBoard(aspectRatio);
    box = GetMaze(board, width * .9, height * .9, scene);
  
  };
  
  let direction = -1;
  let axis = 'y';
  
  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene:Scene) => {
    if (box !== undefined && box !== null) {
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();
  
      const rpm = 5;
      //(box.rotation as any)[axis] += direction * (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  
      if((box.rotation as any)[axis] > 1/3) {
        direction = -1;
      }
      else if((box.rotation as any)[axis] < -1/3) {
        direction = 1;
      }
  
    }
  };
  
  let touching = false;
  let touchX = 0;
  let touchY = 0;

  
  return (
    <SceneComponent 
      antialias 
      onSceneReady={onSceneReady} 
      onRender={onRender} 
      id="renderCanvas" 
      touchStart={touchStart} 
      touchEnd={touchEnd} 
      touchMove={touchMove} 
      />
  );


  function touchStart(e: TouchEvent<HTMLCanvasElement>) {
    let touch = e.touches[0];
        if (!touch) {
            return;
        }
    touching = true;
    touchX = touch.clientX;
    touchY = touch.clientY;
  }

  function touchMove(e: TouchEvent<HTMLCanvasElement>) {
    let touch = e.touches[0];
    if (!touch) {
        return;
    }
    rotateBox(Math.floor((touch.clientX - touchX)/10), Math.floor((touch.clientY - touchY)/10));
  }

  function touchEnd(e: TouchEvent<HTMLCanvasElement>) {
    touching = false;
    touchX = 0;
    touchY = 0;
    rotateBox(0,0);
  }

  function rotateBox(x:number, y:number) {
    if(box === null) {
      return;
    }

    const maxAngle = 35;

    if(y > maxAngle) y = maxAngle;
    if(y < -maxAngle) y = -maxAngle;
    if(x > maxAngle) x = maxAngle;
    if(x < -maxAngle) x = -maxAngle;

    box.rotation.y = x * Math.PI / -180
    box.rotation.x = y * Math.PI / -180

  }
}

export default App;
