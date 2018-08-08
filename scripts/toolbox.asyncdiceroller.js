(function(Toolbox, $, undefined) {
	'use strict';

	Toolbox.AsyncDiceRoller = (function() {
		function _AsyncDiceRoller() {
			var _this = this;

			this.scan = function () {
				//var inputstring = "/([1-9]\\d*)?d([1-9]\\d*)\\s*([+-−]\\s*\\d+)?/i";
				var inputstring = "/([+−-]\\d+)|(([1-9]\\d*)?d([1-9]\\d*)\\s*([+-−]\\s*\\d+)?([,]\\s*\\d+)?)/i";
				var flags = inputstring.replace(/.*\/([gimy]*)$/, '$1');
				var pattern = inputstring.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
				var regex = new RegExp(pattern, flags);

				$('body').unmark({
					className: 'tb-roller',
					done: function() {
						if (Toolbox.settings.options.AsyncDiceRoller) {
							$('body').markRegExp(regex, {
								element: 'span',
								className: 'tb-roller',
								exclude: [
									'a.view-rules *',
									'div.tb-modal *',
									'.ddb-homebrew-create-form-fields-item-input *'
								],
								ignorePunctuation: [","],
								each: function(item) {
									$(item).attr('title', 'Roll {0}'.format($(item).text()));
								}
							});
						}
					}
				});

				Toolbox.Monsters.scan();
			};

			this.bind = function () {
				$('body').on('click', '.tb-roller', function() {
					var dice = $(this).text().replace(/ /g,''),
				        title = 'Dice Roller';

				    var buttons = [];
				    var roll = {
						label: "Reroll",
						className: '',
						callback: function() {
							$('.tb-modal .fullscreen-modal-content').html(_this.roll(dice, title));
							return false;
						}
					};
					var copy = { label: "Copy",
						className: '',
						callback: function() {

							navigator.clipboard.writeText("[roll]{0}[/roll]".format(dice)).then(
								function() {
									$('.tb-modal .fullscreen-modal-content').append('Copied to clipboard!');
								},
								function(err) {
									$('.tb-modal .fullscreen-modal-content').append("Could not copy text.");
								});
							
							return false;
						}
					};
					var cancel = { label: "Cancel" };
					buttons.push(roll);
					if(Toolbox.settings.options.CopyForForums && navigator.clipboard) buttons.push(copy);
					buttons.push(cancel);

					$.modal(_this.roll(dice, title), title, buttons);

					$('.tb-modal').addClass('tb-modal-small');
				});
			}

			this.roll = function (dice, title) {
				var diceRolls = droll.roll(dice.replace('−', '-')),
					rolls = "";

				if (diceRolls == false) {
					dice = "1d20{0}".format(dice);
					diceRolls = droll.roll(dice);
				}

				if (diceRolls !== false) {
					for (var iRoll = 0; iRoll < diceRolls.rolls.length; iRoll++) {
						rolls += "+ {0} ".format(diceRolls.rolls[iRoll]);
					}
					rolls = rolls.substring(2);
					if (diceRolls.modifier != 0) {
						rolls += ")";
						if (diceRolls.type == 'multiplication') {
							rolls += " × {0}".format(diceRolls.modifier);
						}else{
							rolls += " + {0}".format(diceRolls.modifier);
						}
						rolls = "( " + rolls;
					}
					rolls += " = {0}".format(diceRolls.total);

					var content = '<h6>Rolling {0}</h6><p>{1}</p><h5>Total: {2}</h5>'.format(dice, rolls, diceRolls.total);

					return content;
				}
			};

			this.init = function () {
				return this;
			};

			return this.init();
		};
		return new _AsyncDiceRoller();
	}());

}(window.Toolbox = window.Toolbox || {}, jQuery));