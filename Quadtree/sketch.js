let points = [];
let player;
let speed;

function setup()
{
    createCanvas(800, 800);
    player = new Point(200, 200);
    points.push(player);
    speed = 0.5;
}

function draw()
{
    background(0);

    // Generate and show quadtree

    let qt = new Quadtree(new Rectangle(0, 0, 800, 800), 4);

    for (let p of points)
    {
        qt.insert(p);
    }
    qt.show();

    // Rectangle around player
    
    let playerRect = new Rectangle(player.x-50, player.y-50, 100, 100);

    pointsAroundPlayer = qt.query(playerRect);

    noFill();
    stroke(255, 0, 0);
    rect(playerRect.x, playerRect.y, playerRect.width, playerRect.height);

    // Show points

    noStroke();

    for (let p of points)
    {
        if (p == player)
        {
            fill(0, 0, 255);
        }
        else if (pointsAroundPlayer.includes(p))
        {
            fill(255, 0, 0);
        }
        else
        {
            fill(0, 255, 0);
        }

        circle(p.x, p.y, 5);
    }

    // Spawn particles on click

    if (mouseIsPressed)
    {
        points.push(new Point(mouseX, mouseY));
    }

    // Random motion of particles

    for (let p of points)
    {
        dx = randomGaussian(0, Math.sqrt(deltaTime)) * speed;
        dy = randomGaussian(0, Math.sqrt(deltaTime)) * speed;
        p.x += dx;
        p.y += dy;
    }
}

function insertPoint()
{
    points.push(new Point(random(width), random(height)));
}

function insertPoints(x)
{
    for (let i = 0; i < x; i++)
    {
        insertPoint();
    }
}