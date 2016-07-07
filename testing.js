/**
 * Created by thomascase on 4/22/16.
 */
var base_boss_dmg = 10;
var base_boss_hp = 100;
var base_player_dmg = 20;
var base_player_def = 0;
var base_player_hp = 100;
var base_player_heal = 15;
var turn_counter = 0;
var boss_dmg;
var boss_hp;
var player_dmg;
var player_def;
var player_hp;
var player_heal;
var boss_dead = false;

function bossAttack(){
    var damage_taken = boss_dmg-player_def;
    player_hp -= (damage_taken);
    turn_counter++;
    displayCombat(all_bosses[current_boss].bossName + ' attacks! You take ' + damage_taken + ' damage');
    $('#current_boss').toggleClass('attacking');
    ifrit_attack.play();
    endTurn();
    setTimeout(function(){
        $('#current_boss').toggleClass('attacking');
    }, 1300);
}
function playerAttack(){
    // attack_sound.play();
    boss_hp -= player_dmg;
    setTimeout(function(){
        $('#current_boss').toggleClass('attacked');
    }, 600);
    turn_counter++;
    displayCombat('You deal ' + player_dmg + ' damage to ' + all_bosses[current_boss].bossName);
    setTimeout(function(){
        $('#current_boss').toggleClass('attacked');
    }, 1800);
    endTurn();
}

function playerDefenseUp(bonus){
    defense_sound.play();
    player_def += bonus;
    turn_counter++;
    displayCombat('Defense up by ' + bonus);
}

function playerHeal(){
    player_hp += player_heal;
    if (player_hp > 100){
        player_hp = 100;
    }
    turn_counter++;
    displayCombat('You\'ve healed for ' + base_player_heal);
}

function resetCombat(){
    boss_dmg = base_boss_dmg;
    boss_hp = base_boss_hp;
    player_dmg = base_player_dmg;
    player_def = base_player_def;
    player_hp = base_player_hp;
    player_heal = base_player_heal;
    turn_counter = 0;
    displayCombat('');
    matches = 0;
}

function endTurn(){
    console.log('Turn end: ', turn_counter);
    if (player_hp <= 0){
        cascade_shrink();
        $('.combat_text').html("you have been defeated...");
    }
    else if(boss_hp <= 0){
        $('.combat_text').html('You have slain ' + all_bosses[current_boss].bossName + '!');
        boss_dead = true;
        freeze = true;
        setTimeout(function(){
            $('.enemy_display img').addClass('shrink');
            cascade_shrink();
            $(card_array[card_array.length-1].dom).bind( 'transitionend', function(){
                newGame();
                current_boss++;
                newBoss(current_boss);
            });
        }, 1500)
    }
    else{
        boss_behavior(current_boss, turn_counter);
    }
}
var thaw_turn = null;
var turns_until_thaw = 2;


function freeze_card(cardIndex){
    var temp_card = $(card_array[cardIndex].dom);
    temp_card.find('.status_image').css('opacity', '0.7');
    temp_card.addClass('frozen');
    $('.combat_text').html('Fenrir has frozen some cards! They will thaw in two turns.')
}

function boss_behavior(bossNumber, turnNumber){
    switch (bossNumber){
        case 0: //Ifrit: Damage dealt doubles at 20 turns
            if (turnNumber%15 == 0){
                $('.combat_text').html(all_bosses[bossNumber].name + ' is getting angry...')
            }
            if (turnNumber%20 == 0){
                $('.combat_text').html(all_bosses[bossNumber].name + 'is MAD. Boss damage dealt is doubled');
                boss_dmg *= 2;

            }
          break;
        case 1: //Fenrir: randomly freeze 4 cards for 2 turns
            if (turnNumber % 5 == 0){
                freeze = true;
                console.log('fenrir is freezing!');
                setTimeout('')
                thaw_turn = turnNumber + turns_until_thaw; //cards frozen until turn #thaw_turn
                for (var freeze_counter = 0; freeze_counter < 3; freeze_counter){
                    var random_card_index = Math.floor((Math.random() * card_array.length ));
                    if($(card_array[random_card_index]).is('.frozen') || $(card_array[random_card_index]).find('.front').is('.matched')){
                        console.log('cant freeze that');
                    }
                    else{
                        freeze_card(random_card_index);
                        freeze_counter++;
                    }
                }
            }
            if (thaw_turn == turnNumber){
                console.log('thawing: ' , thaw_turn, turnNumber);
                $('.game-area .card.frozen').find('.status_image').css('opacity', '0');
                setTimeout(function(){
                    $('.game-area .card.frozen').removeClass('frozen');
                    thaw_turn = null;
                    $('.combat_text').html('Your cards have thawed.')
                }, 1000);
            }
    }
}
var timeout_var;
function displayCombat(text_to_display){
    clearTimeout(timeout_var);
    $('.combat_text').css('opacity', '1');
    $('#attack_value').html(player_dmg);
    $('#defense_value').html(player_def);
    $('#hp_value').html(player_hp);
    $('#heal_value').html(player_heal);
    $('#boss_hp_value').html(boss_hp);
    $('#turns').html(turn_counter);
    $('.combat_text').html(text_to_display);
    timeout_var = setTimeout(function(){
        $('.combat_text').css('opacity', '.2');
    }, 1800);
}

$(document).ready(function(){
    displayCombat();
});