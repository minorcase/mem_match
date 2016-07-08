/**
 * Created by thomascase on 4/19/16.
 */

/*
 Further functionality:
 I'd like it so that every time you beat a boss it starts a new level with a new boss (new boss image, new background image)
 We can call the new_game function SORT OF when we do that. We have to be careful with everything that happens when we press new game.
 Really what we have to be careful of is the reset_combat function... that thing is gonna reset all the stats back to their OG ravana stats
 We may need a separate button to reset the current boss fight vs resetting the whole game (going back to the first boss)
 We can represent what boss we are on by using a global int. This int could be used in the new game function to load up the bosses images and stats
 */
// var snd = new Audio
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var freeze = false;
var cards = 18;
var matched_cards = [];
var attack_sound = new Audio('audio/attack_sound.wav');
var defense_sound = new Audio('audio/defense_sound.wav');
var heal_sound = new Audio('audio/heal_sound.wav');
var ifrit_attack = new Audio('audio/ifrit_attack.wav');
current_boss = 0;
matches_until_clear = 5;
matches = 0;
attempts = 0;
accuracy = 100;
games_played = 0;
//the blank_card html string
var card = function new_card(id){
    this.card_sound = new Audio('audio/draw.wav');
    this.shrink_sound = new Audio('audio/card_fade.wav');
    this.grow_sound = new Audio('audio/card_grow.wav');
    this.card_template = '<div class="card shrink" data-id-num=' + id + ' data-type=""> <div class="back"> <img class="status_image" src="images/frozen_image.png"> <img class="back_image" src="images/back_image.jpg"> </div> <div class="front flipcard"> <img class="front_icon" src=""> <img class="front_img" src=""> </div> </div>';
    this.dom = $.parseHTML(this.card_template);
    this.front_image = $(this.dom).find('.front .front_img');
    this.combat_info = {};
    this.front = $(this.dom).find('.front');
    this.back = $(this.dom).find('.back');
    this.status_image = $(this.dom).find('.back .status_image');
    this.set_coordinates = function(x_to_add, y_to_add){
        this.x_coord = x_to_add;
        this.y_coord = y_to_add;
    };
    this.add_id = function(id_to_add){
        $(this.dom).attr('id', id_to_add);
    };
    this.add_status = function(status_to_add){
        //switch statement on the status being added will call the appropriate function to add a status?
    };
    this.add_front_image_source = function(source_string){
        $(this.front_image).attr('src', source_string);
    };
    this.get_front_image_source = function(){
        return $(this.front_image).attr('src');
    }
    this.flip_card = function(){
        $(this.dom).children().toggleClass('flipcard');
    };
    this.toggle_active = function(){
        $(this.dom).children().toggleClass('active');
    };
    this.mark_as_correct = function(){
        $(this.dom).children().toggleClass('matched');
    };
    this.mark_as_wrong = function(){
        $(this.dom).children().toggleClass('wrong');
    };
    this.return_to_neutral = function(){
        $(this.dom).children().removeClass('wrong');
        $(this.dom).children().removeClass('active');
        $(this.dom).children().removeClass('matched');
        $(this.dom).children().removeClass('shrink');
        // $(this.dom).children().toggleClass('flipcard');
        $(this.dom).removeClass('shrink');
    };
    this.player_attack = function(){
        //animate here
        this.attack_animation();
        playerAttack();
    };
    this.player_heal = function(){
        this.heal_animation();
        playerHeal();
    };
    this.playerDefenseUp = function(bonus){
        playerDefenseUp(bonus);
    };
    this.add_type = function(type_to_add){
        $(this.dom).attr('data-type' , type_to_add);
    };
    this.attack_animation = function(){
        var horizontal_move = this.x_coord * 93 + 193;
        var vertical_move = this.y_coord * 150 - 120;
        console.log('animation running');
        var animated_card =  $(this.dom);
        setTimeout(function(){
            attack_sound.play();
            animated_card.animate({
                right: '+='+horizontal_move+'px',
                bottom: '+='+vertical_move+'px'
            }, 300, 'easeInCubic');
            animated_card.animate({
                right: '0',
                bottom: '0',
            }, 500)
        },  500);
    };
    this.heal_animation = function(){
        var animated_card =  $(this.dom);
        setTimeout(function(){
            $(animated_card).find('.front').animate({
                'background-color': 'white',
            }, 100, 'easeInCubic')
            heal_sound.play();
        }, 500);
        setTimeout(function() {
            $(animated_card).find('.front').animate({
                'background-color': '#00243B'
            })
        }, 1000)
    };
    // this.undo_animation = function(){
    //     var animated_card = $(this.dom);
    //     animated_card.animate({
    //         right: '0',
    //         bottom: '0',
    //     }, 500)
    // }

};
var card_array = [];
var all_bosses = [
    {
        bossName: 'Ifrit',
        bossImage: 'images/shane.jpg',
        bossBackground: 'images/ravana_bg.jpg'
    },
    {
        bossName: 'Fenrir',
        bossImage: 'images/boss_fenrir.png',
        bossBackground: 'images/fenrir-bg.jpg'
    },
    {
        bossName: 'Titan',
        bossImage: 'images/titan.png',
        bossBackground: 'images/fenrir-bg.jpg'
    }];
function add_images(array){ //loads information about cards into an array for later use
    array.push({source:'images/drk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/drk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/drk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/drk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/monk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/monk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/monk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/monk.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/BRD.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/BRD.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/BRD.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/BRD.png', type: 'attack', icon:'images/ATK_icon.png'});
    array.push({source:'images/PLD.png', type: 'defense', icon:'images/DEF_icon.png'});
    array.push({source:'images/PLD.png', type: 'defense', icon:'images/DEF_icon.png'});
    array.push({source:'images/WHM.png', type: 'heal', icon:'images/HEAL_icon.png'});
    array.push({source:'images/WHM.png', type: 'heal', icon:'images/HEAL_icon.png'});
    array.push({source:'images/WHM.png', type: 'heal', icon:'images/HEAL_icon.png'});
    array.push({source:'images/WHM.png', type: 'heal', icon:'images/HEAL_icon.png'});
}
//Function newGame
//Inputs: none
//Returns: none
//Result: Clears the game area, shuffles and re-deals the cards
function newGame(){
    var sources= [];
    var current_row = -1;
    add_images(sources); //enters the images into the sources array
    $('.game-area').html(''); //clears the game board
    for(var i = 0; i < cards; i++){ //adds cards to the card_array one by one
        if( i % 6 == 0){
            current_row++;
        }
        card_array[i] = new card(i); //Turns the blank_card template into a DOM element and places it into card_array
        var random_source = Math.floor((Math.random() * sources.length )); //Randomly picks a source out of the remaining images in the source array
        //console.log(random_source);
        // $(card_array[i]).find('.front .front_img').attr('src', sources[random_source].source); //Adds the random image source to the card that was just placed in card_array
        card_array[i].add_front_image_source(sources[random_source].source);
        //$(card_array[i]).attr('data-Type', sources[random_source].type); //adds the type
        card_array[i].add_type(sources[random_source].type);
        $(card_array[i].dom).find('.front_icon').attr('src', sources[random_source].icon);//adds the icon
        // card_array[i].add_id(''+ i);
        card_array[i].set_coordinates(i%6, current_row);
        sources.splice(random_source, 1);//Removes the image source from the sources array to ensure each each picture is only used twice
    }//after completion of this loop, all cards are DOM elements with valid image sources
    for (i = 0; i < card_array.length; i++){
        $('.game-area').append(card_array[i].dom); //Adds the cards one by one to the game board
    }
    for (var x = card_array.length-1; x >= 0; x--){
        (function(){//closures are cool
            var inX = x;
            setTimeout(
                function(){
                    card_array[inX].grow_sound.play();
                    // console.log('should be changing');
                    // console.log('object inside timeout: ', $(card_array[inX]));
                    $(card_array[inX].dom).removeClass('shrink');
                }
                , 100*x)
        })()
    }
    resetCombat();
    reset_game();
}
// -- displays updated stats in the stats panel
function display_stats(){
    $('.games_played .value').html(games_played);
    $('.attempts .value').html(attempts);
    if(attempts == matches) {
        $('.accuracy .value').html('%100');
    }
    else{
        var formatted_acc = '%'+accuracy.toFixed(2).slice(2);
        $('.accuracy .value').html(formatted_acc);
    }
}
function update_acc(){
    accuracy = matches/attempts;
}
// -- resets the stats for an individual game
function reset_stats(){
    accuracy = 0;
    matches = 0;
    attempts = 0;
    display_stats();
}
// -- resets game stats, clears card selectors, increments game counter
function reset_game(){
    if (freeze)
        return;
    reset_stats();
    games_played++;
    display_stats();
    match_types = [];
    first_card_clicked = null;
    second_card_clicked = null;
}
function get_random_attack_source(){
    var temp_sources = ['images/DRK.png', 'images/monk.png', 'images/BRD.png'];
    return temp_sources[Math.floor((Math.random() * temp_sources.length ))];
}
// -- Executes after three matches: adds a new row of cards to the game area. Maintains the same ratio of card types.
function new_cards(){
    console.log('new row');
    var matched_types = [];
    for (var i = 0; i < matched_cards.length; i++){
        matched_types.push($(matched_cards[i]).attr('data-type'));
    }
    $('.game-area .card *').removeClass('shrink');
    $('.game-area .card .matched').toggleClass('flipcard');
    $('.game-area .card *').removeClass('matched');
    for (var i = 0; i < matches_until_clear; i++){
        var random_index = 0;
        var random_source = '';
        switch (matched_types[i]){
            case 'attack':
                random_index = Math.floor((Math.random() * matched_cards.length-1 ) + 1);
                random_source = get_random_attack_source();
                $(matched_cards[random_index]).find('.front .front_img').attr('src', random_source);
                $(matched_cards[random_index]).find('.front .front_icon').attr('src', 'images/ATK_icon.png');
                $(matched_cards[random_index]).attr('data-type', 'attack');
                matched_cards.splice(random_index, 1);
                random_index = Math.floor((Math.random() * matched_cards.length-1 ) + 1);
                $(matched_cards[random_index]).find('.front .front_img').attr('src', random_source);
                $(matched_cards[random_index]).find('.front .front_icon').attr('src', 'images/ATK_icon.png');
                $(matched_cards[random_index]).attr('data-type', 'attack');
                matched_cards.splice(random_index, 1);
                console.log('splicing out matched_cards number: ', random_index);
                break;
            case 'defense':
                random_index = Math.floor((Math.random() * matched_cards.length-1 ) + 1);
                $(matched_cards[random_index]).find('.front .front_img').attr('src', 'images/PLD.png');
                $(matched_cards[random_index]).find('.front .front_icon').attr('src', 'images/DEF_icon.png');
                $(matched_cards[random_index]).attr('data-type', 'defense');
                matched_cards.splice(random_index, 1);
                random_index = Math.floor((Math.random() * matched_cards.length-1 ) + 1);
                $(matched_cards[random_index]).find('.front .front_img').attr('src', 'images/PLD.png');
                $(matched_cards[random_index]).find('.front .front_icon').attr('src', 'images/DEF_icon.png');
                $(matched_cards[random_index]).attr('data-type', 'defense');
                matched_cards.splice(random_index, 1);
                console.log('splicing out matched_cards number: ', random_index);
                break;
            case 'heal':
                random_index = Math.floor((Math.random() * matched_cards.length-1 ) + 1);
                $(matched_cards[random_index]).find('.front .front_img').attr('src', 'images/WHM.png');
                $(matched_cards[random_index]).find('.front .front_icon').attr('src', 'images/HEAL_icon.png');
                $(matched_cards[random_index]).attr('data-type', 'heal');
                matched_cards.splice(random_index, 1);
                random_index = Math.floor((Math.random() * matched_cards.length-1 ) + 1);
                $(matched_cards[random_index]).find('.front .front_img').attr('src', 'images/WHM.png');
                $(matched_cards[random_index]).find('.front .front_icon').attr('src', 'images/HEAL_icon.png');
                $(matched_cards[random_index]).attr('data-type', 'heal');
                matched_cards.splice(random_index, 1);
                console.log('splicing out matched_cards number: ', random_index);
                break;
            default:
                console.log('error');
        }
    }
    // for(var i = 0; i < card_array.length; i++){
    //     card_array[i].return_to_neutral();
    // }
    $('.game-area .card').removeClass('shrink');
    freeze = false;
}
function clear_matched(){
    $('.matched').addClass('shrink');
    // $('.matched').find('.front .front_img').attr('src', 'images/back_image.jpg');
    setTimeout(function(){
        // $('.matched').remove();
        if(boss_dead == false){
            new_cards();
        }
    }, 1200);
    freeze = false;
}
function on_first_click(card){
    var clicked_card = card_array[$(card).attr('data-id-num')];
    clicked_card.flip_card();
    clicked_card.toggle_active();
}
function on_same_card_click(card){
    var clicked_card = card_array[$(card).attr('data-id-num')]
    return;
}
function on_second_card_click(card){
    var clicked_card = card_array[$(card).attr('data-id-num')]
    clicked_card.flip_card();
    attempts++;
    update_acc();
}
function on_card_match(first_card, second_card){
    var temp_first_clicked = card_array[$(first_card).attr('data-id-num')]
    var temp_second_clicked = card_array[$(second_card).attr('data-id-num')]
    temp_first_clicked.toggle_active();
    temp_first_clicked.mark_as_correct();
    temp_second_clicked.mark_as_correct();
    matches++;
    update_acc();
    var matchtype = $(second_card).attr('data-type');
    switch(matchtype) {
        case 'attack':

            temp_first_clicked.attack_animation();
            temp_second_clicked.player_attack();
            // playerAttack();
            break;
        case 'heal':
            temp_first_clicked.heal_animation();
            temp_second_clicked.player_heal();
            // playerHeal();
            break;
        case 'defense':
            playerDefenseUp(2);
            break;
        default:
            console.log('wat');
    }
    // matched_cards.push(first_card_clicked, second_card_clicked);
}
function on_card_mismatch(first_card, second_card) {
    var temp_first_clicked = card_array[$(first_card).attr('data-id-num')]
    var temp_second_clicked = card_array[$(second_card).attr('data-id-num')]
    temp_first_clicked.toggle_active();
    temp_first_clicked.mark_as_wrong();
    temp_second_clicked.mark_as_wrong();
    display_stats();
    setTimeout(function(){
        temp_first_clicked.flip_card();
        temp_second_clicked.flip_card();
        temp_first_clicked.return_to_neutral();
        temp_second_clicked.return_to_neutral();
        bossAttack();
        freeze = false
    }, 1500)
}
var first_card_clicked_front_image;
var second_card_clicked_front_image
//function to handle checking matches etc. when a card is clicked
function card_clicked() {
    //Preliminary check to see if the card clicked has already been matched or if the matching mechanic if frozen
    if (!($(this).is('.matched, .frozen')) && !freeze && !($(this).find('.front').is('.matched'))) {
        var clicked_id = $(this).attr('data-id-num');
        console.log(card_array[clicked_id]);
        card_array[clicked_id].card_sound.play();
        // -- if no other card is currently selected make this the currently selected card
        // -- Toggle the 'active' class which produces a white border around the selected card.
        if (first_card_clicked === null) { //clicking on the first card
            first_card_clicked = this;
            first_card_clicked_front_image = $(this).find('.front .front_img').attr('src');
            on_first_click(first_card_clicked);
            return;
        }
        // -- Code within this 'else' statement only executes when clicking the second card
        else {
            if (this === first_card_clicked) { //nothing happens if you click the same card twice
                on_same_card_click(this);
                return;
            }
            second_card_clicked = this;
            second_card_clicked_front_image = $(this).find('.front .front_img').attr('src');
            on_second_card_click(this);
            // -- This if statement executes if the first_card_clicked and second_card_clicked have the same front image source (indicating a match)
            if (first_card_clicked_front_image == second_card_clicked_front_image) {
                on_card_match(first_card_clicked, second_card_clicked);
                matched_cards.push(first_card_clicked, second_card_clicked);
                if (matches % matches_until_clear == 0) {//clears the matched cards every so often
                    freeze = true;
                    setTimeout(clear_matched, 1500);
                }
                //-- boss combat event would go here regardless. player comes first to be a little more forgiving
                first_card_clicked = second_card_clicked = null;
                display_stats();
            }
            else {//This executes if there is NOT a match.
                freeze = true;
                on_card_mismatch(first_card_clicked, second_card_clicked);
                first_card_clicked = second_card_clicked = null;
            }
        }
    }
}
var y = 0;
function cascade_shrink(){
    freeze = true;
    for (var x = 0; x < card_array.length; x++){
        console.log('object outside timeout: ', $(card_array[x]));
        (function(){//closures are cool
            var inX = x;
            setTimeout(
                function(){
                    card_array[inX].shrink_sound.play();
                    $(card_array[inX].dom).addClass('shrink');
                }
                , 100*x)
        })();
    }
}
function newBoss(bossIndex){
    $('.enemy_display img').attr('src', all_bosses[bossIndex].bossImage);
    $('.enemy_display').css('background-image', 'url(' +  all_bosses[bossIndex].bossBackground  +')');
    freeze = false;
    setTimeout(function(){
        boss_dead = false;
        $('.combat_text').html(all_bosses[current_boss].bossName);
        $('.enemy_display img').removeClass('shrink');
    }, 500)
}
console.log("js loaded");
$(document).ready(function(){
    display_stats();
    newGame();
    $('#game-area').on('click', '.card', card_clicked);
});