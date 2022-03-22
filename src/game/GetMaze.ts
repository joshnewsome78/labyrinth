import { CSG, Mesh, MeshBuilder, Nullable, Scene, StandardMaterial, Texture } from "@babylonjs/core";
import Board from "./Board";

export default function GetMaze(board:Board, width:number, height:number, scene:Scene):Nullable<Mesh> {
    const wallDepth = .4;
    const wallThickness = width/128;
    const cellWidth = width/board.boardWidth;
    const cellHeight = height/board.boardHeight;
    let meshArray:Mesh[] = [];
    let holeArray:Mesh[] = [];

    let ground = MeshBuilder.CreateBox("ground", { width: width, depth:.1, height:height });

    board.boardArray.forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            let cellX = cellIdx * cellWidth - width/2 + cellWidth/2;
            let cellY = -rowIdx * cellHeight + height/2 - cellHeight/2;
            cell.CenterX = cellX;
            cell.CenterY = cellY;
            let sideCount = 0;
            if(cell.Top) {
                let wall = MeshBuilder.CreateBox(`top_${rowIdx}_${cellIdx}`, {depth:wallDepth, width: cellWidth, height:wallThickness})
                wall.position.x = cellX;
                wall.position.y = cellY + cellHeight/2;
                wall.position.z = -wallDepth/2;
                meshArray.push(wall);
                sideCount++;
            }
            if(cell.Bottom) {
                let wall = MeshBuilder.CreateBox(`bottom_${rowIdx}_${cellIdx}`, {depth:wallDepth, width: cellWidth, height:wallThickness})
                wall.position.x = cellX;
                wall.position.y = cellY - cellHeight/2;
                wall.position.z = -wallDepth/2;
                meshArray.push(wall);
                sideCount++;
            }
            if(cell.Left) {
                let wall = MeshBuilder.CreateBox(`left_${rowIdx}_${cellIdx}`, {depth:wallDepth, width: wallThickness, height:cellHeight})
                wall.position.x = cellX - cellWidth/2;
                wall.position.y = cellY;
                wall.position.z = -wallDepth/2;
                meshArray.push(wall);
                sideCount++;
            }
            if(cell.Right) {
                let wall = MeshBuilder.CreateBox(`right_${rowIdx}_${cellIdx}`, {depth:wallDepth, width: wallThickness, height:cellHeight})
                wall.position.x = cellX + cellWidth/2;
                wall.position.y = cellY;
                wall.position.z = -wallDepth/2;
                meshArray.push(wall);
                sideCount++;
            }
            if(sideCount > 2 && Math.floor(Math.random() * 2) === 0) {
                let hole = MeshBuilder.CreateCylinder(`hole_${rowIdx}_${cellIdx}`, { height:wallDepth, diameter:cellWidth/1.5})
                hole.position.x = cellX;
                hole.position.y = cellY;
                hole.rotation.x = 1.571;
                holeArray.push(hole);
                cell.HoleInCenter = true;
            }
        });
    });

    let groundCSG = CSG.FromMesh(ground);
    holeArray.forEach(hole => {groundCSG = groundCSG.subtract(CSG.FromMesh(hole)); hole.dispose();});
    ground.dispose();

    let groundMesh = groundCSG.toMesh("maze", null, scene);
    meshArray.push(groundMesh);

    let maze = Mesh.MergeMeshes(meshArray);

    const mazeMaterial = new StandardMaterial("mazeMaterial", scene);
    mazeMaterial.diffuseTexture = new Texture("ash.jpg", scene);
    if(maze) {
        maze.material = mazeMaterial;
    }

    return maze;
}