const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		time: 0,
		timeout : 0,
		dificultyMultiplier: 0
	},
	created: function(){
		this.username = sessionStorage.getItem("username","unknown");
		var options_data;
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		options_data = JSON.parse(json);
		this.num_cards = options_data.cards;
		switch (options_data.dificulty){
			case 'easy':
				this.time = 2000;
				dificultyMultiplier = 5;
				break;
			case 'normal':
				this.time = 700;
				dificultyMultiplier = 10;
				break;
			case 'hard':
				this.time = 200;
				dificultyMultiplier = 20;
				break;
			default:
				this.time = 700;
				dificultyMultiplier = 10;
				break;
		}
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: true, texture: this.items[i]});
		}
		this.timeout= setTimeout(girarCartes,this.time);
		var itemAux = this.items;
		var cardAux = this.current_card;
		function girarCartes(){
			cardAux.splice(0,cardAux.length)
			for (var i = 0; i < itemAux.length; i++){
				cardAux.push({done: false, texture: back});
			}
		}
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back){
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
			}
		}
	},
	watch: {	
		current_card: function(value){
			if (value.texture === back) return;
			var front = null;
			var i_front = -1;
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done && this.current_card[i].texture !== back){
					if (front){
						if (front.texture === this.current_card[i].texture){
							front.done = this.current_card[i].done = true;
							this.num_cards--;
						}
						else{
							Vue.set(this.current_card, i, {done: false, texture: back});
							Vue.set(this.current_card, i_front, {done: false, texture: back});
							this.bad_clicks++;
							break;
						}
					}
					else{
						front = this.current_card[i];
						i_front = i;
					}
				}
			}			
		}
	},
	computed: {
		score_text: function(){
			return 100 - this.bad_clicks * dificultyMultiplier;
		}
	}
});





