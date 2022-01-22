var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameover, gameoverimg, restart, restartimg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 1;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverimg = loadImage("gameOver.png")
  restartimg = loadImage("restart.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
 gameover = createSprite(width/2, height-70, 20, 20);
 gameover.addImage(gameoverimg);
restart = createSprite(width/2, height-140, 40, 40);
restart.addImage(restartimg);
  trex = createSprite(50, height-20, 20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 55);
  trex.debug = false;
  
  ground = createSprite(width/3,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4 - score/100;
  
  invisibleGround = createSprite (190, height- 5 , 400, 10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background("black");
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    //mover o solo
    ground.velocityX = -4 - score/100;
    if((touches.length>0||keyDown("space"))&& trex.y >= height - 45) {
      trex.velocityY = -13;
      touches = [];
    }
    
  restart.visible = false
  gameover.visible = false
    console.log(trex.y)
                
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    trex.collide(invisibleGround);
    
    //gere as nuvens
    spawnClouds();
    
    //gere obstáculos no solo
    spawnObstacles();

    trex.changeAnimation ("running", trex_running)
  
    if (trex.isTouching(obstaclesGroup)){
      gameState = END;
  }
}
  else if(gameState === END){
    //parar o solo
    trex.changeAnimation("collided" , trex_collided);
    ground.velocityX = 0;
    trex.velocityY = 0;
    restart.visible = true
    gameover.visible = true
    obstaclesGroup.setVelocityXEach(0)

    cloudsGroup.setVelocityXEach(0)

    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)

    if(touches.length>0 || mousePressedOver(restart)){

      touches = [];
      reset();
    }
  }
  drawSprites();
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width, height - 35,10,40);
   obstacle.velocityX = -6 - score/100;

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,height - 100,40,10);
    cloud.y = Math.round(random(height - 190,height - 160));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3 - score/100;
    
     //atribuir vida útil à variável
    cloud.lifetime = 400;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  


}


function reset(){

  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;


}
