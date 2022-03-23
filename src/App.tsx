import React, { useEffect, TouchEvent, useState } from 'react';
import './App.css';
import CreateBoard, { Cell } from './game/Board';
import Board from './game/Board';
import SceneComponent from './SceneComponent';
import { AmmoJSPlugin, ArcRotateCamera, CameraInputTypes, Color4, DirectionalLight, FreeCamera, HemisphericLight, IPhysicsEngine, Mesh, MeshBuilder, Nullable, PhysicsEngine, PhysicsImpostor, Scene, StandardMaterial, Texture, Tools, Vector3 } from '@babylonjs/core';
import GetMaze from './game/GetMaze';
import StartModal from './components/StartModal';

function App() {

  const [showStartModal, setShowStartModal] = useState(false);

  let physicsEngine:Nullable<IPhysicsEngine>;
  let camera:ArcRotateCamera;

  useEffect(() => {
    setShowStartModal(true);
    return () => setShowStartModal(false);
  },[]);

  const handleStart = () => {
    setShowStartModal(false);
    if ( DeviceMotionEvent && typeof (DeviceMotionEvent as any).requestPermission === "function" ) {
      (DeviceMotionEvent as any).requestPermission();
    }

    window.addEventListener("deviceorientation", (event) => {
      if(physicsEngine && event.alpha && event.beta) {
        physicsEngine.setGravity(new Vector3(-event.alpha, -event.beta, 9.8));
      }
    });

  }

  const onSceneReady = (scene:Scene) => {
    scene.clearColor = new Color4(0, 0, 0);

    camera = new ArcRotateCamera("camera", 0, 0, 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(0,0,-10));
    let canvas = scene.getEngine().getRenderingCanvas();

    camera.attachControl(canvas);
    camera.lowerBetaLimit = Tools.ToRadians(80);
    camera.upperBetaLimit = Tools.ToRadians(100);
    camera.lowerAlphaLimit = Tools.ToRadians(-100);
    camera.upperAlphaLimit = Tools.ToRadians(-80);
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 10;
    camera.inputs.remove(camera.inputs.attached.mousewheel);
    
  
    const engine = scene.getEngine();

    var fov = camera.fov;
    var aspectRatio = engine.getAspectRatio(camera);
    var d = camera.position.length();
    var height = 2 * d * Math.tan(fov / 2);
    var width = height * aspectRatio;
  
    var light = new HemisphericLight("light", new Vector3(width/3, height/3, -20), scene);
    light.intensity = 0.55;


    const board = Board.GenerateRandomBoard(aspectRatio);
    const maze = GetMaze(board, width * .9, height * .9, scene);

    let marble = MeshBuilder.CreateSphere('marble',{diameter:width/(2 * board.boardWidth)}, scene);
    let startCell = board.boardArray[0][Math.floor(Math.random() * board.boardWidth)];
    while(startCell.HoleInCenter) {
      startCell = board.boardArray[0][Math.floor(Math.random() * board.boardWidth)];
    }
    marble.position.x = startCell.CenterX;
    marble.position.y = startCell.CenterY;
    marble.position.z = -width/(2 * board.boardWidth);
    const marbleMaterial = new StandardMaterial("marbleMaterial", scene);
    marbleMaterial.diffuseTexture = new Texture("metal.jpg", scene);
    marble.material = marbleMaterial;

    
    scene.enablePhysics(new Vector3(0,0,9.8), new AmmoJSPlugin());
    physicsEngine = scene.getPhysicsEngine();

    marble.physicsImpostor = new PhysicsImpostor(marble, PhysicsImpostor.SphereImpostor, {mass:1, friction:.1}, scene);

    if(maze) {
      maze.physicsImpostor = new PhysicsImpostor(maze, PhysicsImpostor.MeshImpostor,{mass:0, friction:1},scene);
    } 
        

  };
  
  const onRender = (scene:Scene) => {
    if(!physicsEngine) {
      return;
    }
    physicsEngine.setGravity(new Vector3(-camera.position.x, -camera.position.y, -camera.position.z));
  };
  
  return (
    <>
    <SceneComponent 
      antialias 
      onSceneReady={onSceneReady} 
      onRender={onRender} 
      id="renderCanvas" 
      />
      <StartModal show={showStartModal} closeHandler={handleStart} />
      </>
  );
}

export default App;
