"use strict";

class Player {
  constructor(name) {
    this.name = name;
  }
}


class Game {

  constructor(player) {

    this.player = player;
    this.beans = 0;

    this.workers = new Upgrade("worker",0,30,1.5,new UpgradeButton(`Hire a worker (${this.cost} beans)`));
    this.workerRate = new Upgrade("workerRate",1,200,1.3,new UpgradeButton(`Increase worker productivity (${this.cost} beans)`));
    this.clickAmount = new Upgrade("clickAmount",1,15,1.3,new UpgradeButton(`Increase beans per click (${this.cost} beans)`));

    this.beansDisplay = new Display(document.querySelector("#beans-container"),`${this.beans}`)
    this.beansPerClickDisplay = new Display(document.querySelector("#beans-per-click-container"),`${this.clickAmount.playerHas} beans per click`);
    this.workerDisplay = new Display(document.querySelector("#workers-container"),`${this.workers.playerHas} workers producing ${this.workerRate.playerHas} beans/s`);

    document.querySelector("#increment-button").addEventListener("click", this.onClick.bind(this));

    setInterval(this.tick.bind(this),1000);
  }
  tick() {
    console.log(`tick. beans:${this.beans}`)
    this.beans += this.workers.playerHas * this.workerRate.playerHas;
    this.update.call(this);

  }

  onClick() {
    this.beans += this.clickAmount.playerHas;
    this.update();
  }

  update() {
    this.updateDisplays();
    this.updateUpgradeButton(this.workers.button.element,this.beans);
    this.updateUpgradeButton(this.workerRate.button.element,this.beans);
    this.updateUpgradeButton(this.clickAmount.button.element,this.beans);
  }

  updateDisplays() {
    if (this.beans > 0) {
    this.beansDisplay.updateMessage();
    }
    if (this.workers.playerHas > 0) {
      this.workerDisplay.updateMessage();
    }
    if (this.clickAmount.playerHas > 1) {
      this.beansPerClickDisplay.updateMessage();
    }
  }

  updateUpgradeButton(upgrade,beans) {

     if (beans >= upgrade.cost) {

        if (upgrade.button.isVisible) {
            upgrade.button.updateMessage();

        } else {
            upgrade.button.connect();
        }
     } else if (beans < upgrade.cost && upgrade.button.isVisible) {
          upgrade.button.disconnect();
     }

  }

}

class Upgrade {
    constructor(name,playerHas,cost,costMultiplier,button) {
      this.name = name;
      this.playerHas = playerHas;
      this.cost = cost;
      this.costMultiplier = costMultiplier;
      this.button = button;
    }

    updateCost() {
      this.cost *= this.costMultiplier;
    }

    purchase() {
      this.playerHas++;
      return this.cost;
    }
  }


class Display {
  constructor(element,message) {
    this.element = element;
    this.message = message;
  }
  updateMessage() {
    this.element.textContent = this.message;
  }
}


class UpgradeButton extends Display {

  constructor(message) {
    super(document.createAttribute("button"),message);
    this.upgradesContainer = document.querySelector("#upgrades-container");
    this.isVisible = false;
  }

    connect() {
      this.upgradesContainer.appendChild(this.element);
      this.isVisible = true;
    }

    disconnect() {
      this.upgradesContainer.removeChild(this.element);
      this.isVisible = false;
    }
  }

  let game = new Game(new Player("Axa"));