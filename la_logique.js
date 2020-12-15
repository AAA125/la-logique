function Person(x, y) {
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.state = NORMAL;
  this.infectedTime = 0;
  this.socialDistance = false;
  
  this.move = function() {
    if (this.state == DEAD) {
      return;
    }
    
    this.pos.add(this.vel);
    this.keepInBounds();
    
    this.interactWithOthers();
    
    if (this.state == SICK) {
      this.tryToRecover();
    }
  }
  
  this.interactWithOthers = function() {
    for (let i = 0; i < _people.length; i++) {
      let other = _people[i];
      if (this == other || other.state == DEAD) {
        continue;
      }
      
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      
      if (d < personSize) {
        if (this.state == SICK || other.state == SICK) {
          if (this.state == NORMAL) {
            this.setState(SICK);
          }
          
          if (other.state == NORMAL) {
            other.setState(SICK);
          }
        }
        
        if (_collisions && !this.socialDistance) {
          // Resolve direct collision.
          let newDirection = new p5.Vector(this.pos.x, this.pos.y);
          newDirection.sub(other.pos);
          newDirection.normalize();
          newDirection.mult(personSize - d);
          this.pos.add(newDirection);

          // Bounce to new direction.
          newDirection.normalize();
          this.vel.add(newDirection);
          this.vel.normalize();
        }
        
        break;
      }
    }
  }
  
  this.tryToRecover = function() {
    if (frameCount > this.infectedTime + recoveryTime) {
      if (random() < deathChance / 100.0) {
        this.setState(DEAD);
      } else {
        this.setState(RECOVER);
      }
    }
  }
  
  this.keepInBounds = function() {
    let halfSize = personSize / 2;
    
    if (this.pos.x - halfSize < 0 || this.pos.x + halfSize > _bounds) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, halfSize, _bounds - halfSize);
    }
    
    if (this.pos.y - halfSize < 0 || this.pos.y + halfSize > _bounds) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, halfSize, _bounds - halfSize);
    }
  }
  
  this.display = function() {
    strokeWeight(personSize);
    
    if (this.state == NORMAL) {
      stroke(_normalColor);
    } else if (this.state == SICK) {
      stroke(_sickColor);
    } else if (this.state == RECOVER) {
      stroke(_recoveryColor);
    } else if (this.state == DEAD) {
      stroke(_deadColor);
    }
    
    point(this.pos.x, this.pos.y);
  }
  
  this.setState = function(newState) {
    this.state = newState;
    
    if (newState == SICK) {
      this.infectedTime = frameCount;
      _normalCount --;
      _sickCount++;
    } else if (this.state == RECOVER) {
      _sickCount--;
      _recoveryCount++;
    } else if (this.state == DEAD) {
      _sickCount--;
      _deathCount++;
    }
  }
  
  this.practiceSocialDistance = function() {
    this.vel.mult(0);
    this.socialDistance = true;
    _socialDistanceCount++;
  }
}
