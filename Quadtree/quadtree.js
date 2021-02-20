class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Rectangle
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    contains(point)
    {
        return (point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height);
    }

    intersects(rect)
    {
        return !(rect.x + rect.width < this.x ||
            rect.x > this.x + this.width ||
            rect.y + rect.height < this.y ||
            rect.y > this.y + this.height);
    }
}

class Quadtree
{
    constructor(boundary, capacity)
    {
        this.boundary = boundary;
        this.capacity = capacity;
        this.divided = false;
        this.points = [];
    }

    subdivide()
    {
        let nw = new Rectangle(this.boundary.x, this.boundary.y, this.boundary.width/2, this.boundary.height/2);
        let ne = new Rectangle(this.boundary.x + this.boundary.width/2, this.boundary.y, this.boundary.width/2, this.boundary.height/2);
        let sw = new Rectangle(this.boundary.x, this.boundary.y + this.boundary.height/2, this.boundary.width/2, this.boundary.height/2);
        let se = new Rectangle(this.boundary.x + this.boundary.width/2, this.boundary.y + this.boundary.height/2, this.boundary.width/2, this.boundary.height/2);

        this.northwest = new Quadtree(nw, this.capacity);
        this.northeast = new Quadtree(ne, this.capacity);
        this.southwest = new Quadtree(sw, this.capacity);
        this.southeast = new Quadtree(se, this.capacity);

        this.divided = true;
    }

    insert(point)
    {
        if (!this.boundary.contains(point)) return false;

        if (this.points.length < this.capacity)
        {
            this.points.push(point);
            return true;
        }
        else
        {
            if (!this.divided)
            {
                this.subdivide();
            }

            if (this.northwest.insert(point)) return true;
            if (this.northeast.insert(point)) return true;
            if (this.southwest.insert(point)) return true;
            if (this.southeast.insert(point)) return true;

            console.log("Quadtree failed to insert point");
            return false;
        }
    }

    query(range)
    {
        let points = [];

        if (!this.boundary.intersects(range))
        {
            return points;
        }

        for (let p of this.points)
        {
            if (range.contains(p))
            {
                points.push(p);
            }
        }

        if (this.divided)
        {
            points = points.concat(this.northwest.query(range));
            points = points.concat(this.northeast.query(range));
            points = points.concat(this.southwest.query(range));
            points = points.concat(this.southeast.query(range));
        }

        return points;
    }

    // This function uses the p5js library to show the quadtree, should be removed
    show()
    {
        // Show boundary
        strokeWeight(2);
        stroke(255);
        noFill();
        rect(this.boundary.x, this.boundary.y, this.boundary.width, this.boundary.height);

        // Recursively show children
        if (this.divided)
        {
            this.northwest.show();
            this.northeast.show();
            this.southwest.show();
            this.southeast.show();
        }
    }
}
