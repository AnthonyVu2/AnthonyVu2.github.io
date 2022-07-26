const carCanvas=document.getElementById('carCanvas'); 
carCanvas.width=200; 
const networkCanvas=document.getElementById('networkCanvas'); 
networkCanvas.width=300; 
let added=false;
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road=new Road(carCanvas.width/2,carCanvas.width*.9);
const N=100;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1)
        }
    }
    
}
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2)
];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function addCar(){
    
    
    lane=Math.floor(Math.random()*3);
    if(bestCar.y>traffic[traffic.length-1].y){
        traffic.push(new Car(road.getLaneCenter(lane),traffic[traffic.length-1].y-200,30,50,"DUMMY",2));
    }else{
       // traffic.push(new Car(road.getLaneCenter(lane),bestCar.y-200,30,50,"DUMMY",2));
       /* traffic.push(new Car(road.getLaneCenter(lane),bestCar.y-200,30,50,"DUMMY",2));
        traffic.push(new Car(road.getLaneCenter(lane),bestCar.y-200,30,50,"DUMMY",2));*/
        traffic.push(new Car(bestCar.x,bestCar.y-200,30,50,"DUMMY",2));
        if(Math.abs(bestCar.x-road.getLaneCenter(lane))>30){
            traffic.push(new Car(road.getLaneCenter(lane),bestCar.y-200,30,50,"DUMMY",2));
        }else{
            traffic.push(new Car(road.getLaneCenter(lane),bestCar.y-400,30,50,"DUMMY",2));
        }
       
        
    }
   
   
    
    
    
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;

}

function animate(time){
    
    
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );
    
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);
    carCtx.restore();
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate); 
}
