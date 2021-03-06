class Menu {
	constructor(menu) {
		this.menu = menu;
		this.focused = true;
		this.destroyables = [];

		this.menuOptionSprites = [];
		for(let i = 0; i < menu.options.length; i++) {
			const o = menu.options[i];

			const text = game.phaser.add.text(menu.x, menu.y + (i*40), o.text, {
				font: "24px slkscr",
				fill: i == 0 ? "#f1f1aa" : "#FFFFFF",
				align: "left",
				wordWrap: true,
                stroke: "#444400",
                strokeThickness: 2,
				wordWrapWidth: 600
			});
			text.fixedToCamera = true;
			text.bringToTop();

			menu.options[i].textEl = text;

			this.destroyables.push(text);
			this.menuOptionSprites.push(text);
		}

		this.selectOption(0);

		this.onDownHandler = () => this.moveCursor(1);
		this.onUpHandler = () => this.moveCursor(-1);
		this.onMainHandler = () => this.confirmOption();

		game.input.onDown.add(this.onDownHandler, this);
		game.input.onUp.add(this.onUpHandler, this);
		game.input.onMain.add(this.onMainHandler, this);
	}

	moveCursor(didx) {
		if (!this.focused) return;
		let nidx = this.selectedIdx + didx;
		if (nidx < 0) nidx = this.menu.options.length - 1;
		else nidx = nidx % this.menu.options.length;
		this.selectOption(nidx);
	}

	selectOption(idx) {
		this.selectedIdx = idx;
		for(let i = 0; i < this.menu.options.length; i++) {
			this.menuOptionSprites[i].fill = i == idx ? "#f1f1aa" : "#FFFFFF";
		}
	}

	confirmOption() {
		const opt = this.menu.options[this.selectedIdx];
		opt.callback.bind(opt.context)(opt);
	}

	update() {
		for(let spr of this.menuOptionSprites) spr.bringToTop();
	}

	destroy() {
		game.input.onDown.remove(this.onDownHandler, this);
		game.input.onUp.remove(this.onUpHandler, this);
		game.input.onMain.remove(this.onMainHandler, this);
		for(let d of this.destroyables) d.destroy();
	}
}
