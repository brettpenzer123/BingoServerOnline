const express = require('express');
const http = require('http');
const { hostname } = require('os');
const WebSocket = require('ws');
const fs = require("node:fs");

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({
  server
})

//EMERALD BINGO VARS
var emerald_pause_calling = 0
var emerald_bingo_numbers = [];
var emerald_bingo_numbers_called = [];
var emerald_game_has_started = 0
var emerald_game_has_ended = 0
var emerald_player_has_bingo = 0
var emerald_current_bingo_line = '1 Line'
var emerald_number_of_balls = '90'
var emerald_game_type = 'SLOW BINGO'
var emerald_time_between_calls = 5.5 //(seconds)
var emerald_time_between_rounds = 30 //(seconds)
var emerald_time_between_bingos = 10 //(seconds)
var emerald_initial_pause = 60 //(seconds)
var emerald_timer = 60 //(seconds)

//SAPPHIRE BINGO VARS
var sapphire_pause_calling = 0
var sapphire_bingo_numbers = [];
var sapphire_bingo_numbers_called = [];
var sapphire_game_has_started = 0
var sapphire_game_has_ended = 0
var sapphire_player_has_bingo = 0
var sapphire_current_bingo_line = '1 Line'
var sapphire_number_of_balls = '90'
var sapphire_game_type = 'NORMAL BINGO'
var sapphire_time_between_calls = 4.5 //(seconds)
var sapphire_time_between_rounds = 30 //(seconds)
var sapphire_time_between_bingos = 10 //(seconds)
var sapphire_initial_pause = 120 //(seconds)
var sapphire_timer = 120 //(seconds)

//RUBY BINGO VARS
var ruby_pause_calling = 0
var ruby_bingo_numbers = [];
var ruby_bingo_numbers_called = [];
var ruby_game_has_started = 0
var ruby_game_has_ended = 0
var ruby_player_has_bingo = 0
var ruby_current_bingo_line = '1 Line'
var ruby_number_of_balls = '90'
var ruby_game_type = 'FAST BINGO'
var ruby_time_between_calls = 3.5 //(seconds)
var ruby_time_between_rounds = 30 //(seconds)
var ruby_time_between_bingos = 10 //(seconds)
var ruby_initial_pause = 30 //(seconds)
var ruby_timer = 30 //(seconds)


//SERVER STATS VARS
var total_number_of_players = 0;
var emerald_players_names = [];
var sapphire_players_names = [];
var ruby_players_names = [];

//MAIN VARS
var server_room_names = ['EMERALD', 'SAPPHIRE', 'RUBY'];

for (let i = 0; i < parseInt(emerald_number_of_balls); i++) {
  emerald_bingo_numbers.push(i + 1);
}

for (let i = 0; i < parseInt(sapphire_number_of_balls); i++) {
  sapphire_bingo_numbers.push(i + 1);
}

for (let i = 0; i < parseInt(ruby_number_of_balls); i++) {
  ruby_bingo_numbers.push(i + 1);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }

  return array;
}

shuffle(emerald_bingo_numbers);
shuffle(sapphire_bingo_numbers);
shuffle(ruby_bingo_numbers);

setInterval(function() {
  if (emerald_timer >= 1) {
    emerald_timer--
  }
  if (sapphire_timer >= 1) {
    sapphire_timer--
  }
  if (ruby_timer >= 1) {
    ruby_timer--
  }
  let newarray = 'FROM`HOST`TO`ALL`ROOMID`SERVER`SEND-CLIENT-SERVERINFORMATION`Message`EMERALD:' + emerald_players_names.length + ';' + emerald_game_type + ';' + emerald_number_of_balls + ';' + emerald_timer + ';' + ':SAPPHIRE:' + sapphire_players_names.length + ';' + sapphire_game_type + ';' + sapphire_number_of_balls + ';' + sapphire_timer + ';' + ':RUBY:' + ruby_players_names.length + ';' + ruby_game_type + ';' + ruby_number_of_balls + ';' + ruby_timer + ';'
  wss.clients.forEach(client => client.send(newarray));
}
  , 1 * 1000)

setTimeout(function() {
  setInterval(function() {
    if (emerald_bingo_numbers.length >= 1 && emerald_pause_calling == 0 && emerald_game_has_ended == 0) {
      if (emerald_player_has_bingo == 1) {
        emerald_player_has_bingo = 0
        if (emerald_current_bingo_line == "1 Line") {
          emerald_current_bingo_line = "2 Lines"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`EMERALD`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + emerald_number_of_balls + ':' + 'CURRENTPLAY:' + emerald_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
        else if (emerald_current_bingo_line == "2 Lines") {
          emerald_current_bingo_line = "Full House"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`EMERALD`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + emerald_number_of_balls + ':' + 'CURRENTPLAY:' + emerald_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
        else if (emerald_current_bingo_line == "Full House") {
          emerald_bingo_numbers = [];
          emerald_bingo_numbers_called = [];
        }
      }
      else {
        let number_called = emerald_bingo_numbers.pop();
        emerald_bingo_numbers_called.push("|" + number_called)
        console.log('EMERALD server called number: ' + number_called)
        wss.clients.forEach(client => client.send('FROM`HOST`TO`ALL`ROOMID`EMERALD`SEND-CLIENT-BINGONUMBER`Message`' + number_called.toString()));
      }
    }
    if (emerald_bingo_numbers.length <= 0 && emerald_game_has_ended == 0) {
      emerald_game_has_ended = 1
      emerald_game_has_started = 0
      emerald_players_names = []
      console.log("EMERALD server restarted")
      wss.clients.forEach(client => client.send('FROM`HOST`TO`ALL`ROOMID`EMERALD`SEND-CLIENT-RESTART`Message`'));
      emerald_timer = emerald_time_between_rounds
      setTimeout(function() {
        for (let i = 0; i < parseInt(emerald_number_of_balls); i++) {
          emerald_bingo_numbers.push(i + 1);
        }
        shuffle(emerald_bingo_numbers);
        emerald_bingo_numbers_called = [];
        emerald_game_has_ended = 0
        emerald_game_has_started = 1
        emerald_timer = emerald_time_between_calls * parseInt(emerald_number_of_balls)
        if (emerald_current_bingo_line != "1 Line") {
          emerald_current_bingo_line = "1 Line"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`EMERALD`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + emerald_number_of_balls + ':' + 'CURRENTPLAY:' + emerald_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
      }, emerald_time_between_rounds * 1000)
    }
  }, emerald_time_between_calls * 1000);
  emerald_game_has_started = 1
  emerald_timer = emerald_time_between_calls * parseInt(emerald_number_of_balls)
}, emerald_initial_pause * 1000)

setTimeout(function() {
  setInterval(function() {
    if (sapphire_bingo_numbers.length >= 1 && sapphire_pause_calling == 0 && sapphire_game_has_ended == 0) {
      if (sapphire_player_has_bingo == 1) {
        sapphire_player_has_bingo = 0
        if (sapphire_current_bingo_line == "1 Line") {
          sapphire_current_bingo_line = "2 Lines"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`SAPPHIRE`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + sapphire_number_of_balls + ':' + 'CURRENTPLAY:' + sapphire_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
        else if (sapphire_current_bingo_line == "2 Lines") {
          sapphire_current_bingo_line = "Full House"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`SAPPHIRE`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + sapphire_number_of_balls + ':' + 'CURRENTPLAY:' + sapphire_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
        else if (sapphire_current_bingo_line == "Full House") {
          sapphire_bingo_numbers = [];
          sapphire_bingo_numbers_called = [];
        }
      }
      else {
        let number_called = sapphire_bingo_numbers.pop();
        sapphire_bingo_numbers_called.push("|" + number_called)
        console.log('SAPPHIRE server called number: ' + number_called)
        wss.clients.forEach(client => client.send('FROM`HOST`TO`ALL`ROOMID`SAPPHIRE`SEND-CLIENT-BINGONUMBER`Message`' + number_called.toString()));
      }
    }
    if (sapphire_bingo_numbers.length <= 0 && sapphire_game_has_ended == 0) {
      sapphire_game_has_ended = 1
      sapphire_game_has_started = 0
      sapphire_players_names = []
      console.log("SAPPHIRE server restarted")
      wss.clients.forEach(client => client.send('FROM`HOST`TO`ALL`ROOMID`SAPPHIRE`SEND-CLIENT-RESTART`Message`'));
      sapphire_timer = sapphire_time_between_rounds
      setTimeout(function() {
        for (let i = 0; i < parseInt(sapphire_number_of_balls); i++) {
          sapphire_bingo_numbers.push(i + 1);
        }
        shuffle(sapphire_bingo_numbers);
        sapphire_bingo_numbers_called = [];
        sapphire_game_has_ended = 0
        sapphire_game_has_started = 1
        sapphire_timer = sapphire_time_between_calls * parseInt(emerald_number_of_balls)
        if (sapphire_current_bingo_line != "1 Line") {
          sapphire_current_bingo_line = "1 Line"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`SAPPHIRE`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + sapphire_number_of_balls + ':' + 'CURRENTPLAY:' + sapphire_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
      }, sapphire_time_between_rounds * 1000)
    }
  }, sapphire_time_between_calls * 1000);
  sapphire_game_has_started = 1
  sapphire_timer = sapphire_time_between_calls * parseInt(emerald_number_of_balls)
}, sapphire_initial_pause * 1000)

setTimeout(function() {
  setInterval(function() {
    if (ruby_bingo_numbers.length >= 1 && ruby_pause_calling == 0 && ruby_game_has_ended == 0) {
      if (ruby_player_has_bingo == 1) {
        ruby_player_has_bingo = 0
        if (ruby_current_bingo_line == "1 Line") {
          ruby_current_bingo_line = "2 Lines"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`RUBY`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + ruby_number_of_balls + ':' + 'CURRENTPLAY:' + ruby_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
        else if (ruby_current_bingo_line == "2 Lines") {
          ruby_current_bingo_line = "Full House"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`RUBY`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + ruby_number_of_balls + ':' + 'CURRENTPLAY:' + ruby_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
        else if (ruby_current_bingo_line == "Full House") {
          ruby_bingo_numbers = [];
          ruby_bingo_numbers_called = [];
        }
      }
      else {
        let number_called = ruby_bingo_numbers.pop();
        ruby_bingo_numbers_called.push("|" + number_called)
        console.log('RUBY server called number: ' + number_called)
        wss.clients.forEach(client => client.send('FROM`HOST`TO`ALL`ROOMID`RUBY`SEND-CLIENT-BINGONUMBER`Message`' + number_called.toString()));
      }
    }
    if (ruby_bingo_numbers.length <= 0 && ruby_game_has_ended == 0) {
      ruby_game_has_ended = 1
      ruby_game_has_started = 0
      ruby_players_names = []
      console.log("RUBY server restarted")
      wss.clients.forEach(client => client.send('FROM`HOST`TO`ALL`ROOMID`RUBY`SEND-CLIENT-RESTART`Message`'));
      ruby_timer = ruby_time_between_rounds
      setTimeout(function() {
        for (let i = 0; i < parseInt(ruby_number_of_balls); i++) {
          ruby_bingo_numbers.push(i + 1);
        }
        shuffle(ruby_bingo_numbers);
        ruby_bingo_numbers_called = [];
        ruby_game_has_ended = 0
        ruby_game_has_started = 1
        ruby_timer = ruby_time_between_calls * parseInt(emerald_number_of_balls)
        if (ruby_current_bingo_line != "1 Line") {
          ruby_current_bingo_line = "1 Line"
          let newarray2 = 'FROM`HOST`TO`ALL`ROOMID`RUBY`SEND-CLIENT-SETTINGS`Message`' + 'HOWMANYNUMBERS:' + ruby_number_of_balls + ':' + 'CURRENTPLAY:' + ruby_current_bingo_line + ':'
          wss.clients.forEach(client => client.send(newarray2));
        }
      }, ruby_time_between_rounds * 1000)
    }
  }, ruby_time_between_calls * 1000);
  ruby_game_has_started = 1
  ruby_timer = ruby_time_between_calls * parseInt(emerald_number_of_balls)
}, ruby_initial_pause * 1000)

serverdata = `wss://${hostname}-6969.csb.app`

server.listen(port, function() {
  console.log(`wss://${hostname}-6969.csb.app / Server is listening on ${port}!`)
  fs.writeFile("ServerIP.txt",`wss://${hostname}-6969.csb.app`,function(){});
})

wss.on('connection', function connection(ws) {
  total_number_of_players++;
  ws.on('close', function close() {
    total_number_of_players--;
    if (total_number_of_players <= 0) {
      total_number_of_players = 0
    }
  });
  ws.on('message', function incoming(data) {
    var get_message_sent = ""
    //MAIN SERVER CODE
    if (data.search("ROOMID`SERVER`") != -1 && data.search("SEND-HOST-GETINFORMATION") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      let newarray = 'FROM`HOST`TO`' + myArray2[0].replace('`', '') + '`ROOMID`SERVER`SEND-CLIENT-SERVERINFORMATION`Message`EMERALD:' + emerald_players_names.length + ';' + emerald_game_type + ';' + emerald_number_of_balls + ';' + emerald_timer + ';' + ':SAPPHIRE:' + sapphire_players_names.length + ';' + sapphire_game_type + ';' + sapphire_number_of_balls + ';' + sapphire_timer + ';' + ':RUBY:' + ruby_players_names.length + ';' + ruby_game_type + ';' + ruby_number_of_balls + ';' + ruby_timer + ';'
      ws.send(newarray);
    }
    //EMERALD SERVER CODE
    if (data.search("ROOMID`EMERALD`") != -1 && data.search("SEND-PING") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      console.log(myArray2[0].replace('`', ''))
      var emerald_players = emerald_players_names.indexOf(myArray2[0].replace('`', ''))
      if (emerald_players == -1) {
        emerald_players_names.push(myArray2[0].replace('`', ''))
      }
    }
    if (data.search("ROOMID`EMERALD`") != -1 && data.search("SEND-HOST-CHECKALLROOMS") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      let newarray = 'FROM`HOST`TO`' + myArray2[0].replace('`', '') + '`ROOMID`EMERALD`SEND-ROOM-LOBBY-EXISTS`Message`'
      console.log(myArray2[0].replace('`', '') + " joined the EMERALD server.");
      var emerald_players = emerald_players_names.indexOf(myArray2[0].replace('`', ''))
      if (emerald_players == -1) {
        emerald_players_names.push(myArray2[0].replace('`', ''))
      }
      ws.send(newarray);
    }
    if (data.search("ROOMID`EMERALD`") != -1 && data.search("SEND-HOST-LEAVE") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      console.log(myArray2[0].replace('`', '') + " left the EMERALD server.");
      var emerald_players = emerald_players_names.indexOf(myArray2[0].replace('`', ''));
      emerald_players_names.splice(emerald_players, 1)
    }
    if (data.search("ROOMID`EMERALD`") != -1 && data.search("SEND-HOST-RELAYCHATBOXTEXT") != -1) {
      get_message_sent = "EMERALD_HOSTRELAYCHATBOXTEXT"
    }
    if (data.search("ROOMID`EMERALD`") != -1 && data.search("SEND-HOST-NEEDALLBINGONUMBERS") != -1) {
      //console.log('FROM`My`TO`HOST`ROOMID`EMERALD`SEND-ROOM-LOBBY-EXISTS`Message`')
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      let getoldnumbers = emerald_bingo_numbers_called.toString()
      let newarray = 'FROM`HOST`TO`' + myArray2[0].replace('`', '') + '`ROOMID`EMERALD`SEND-CLIENT-ALLBINGONUMBERS`Message`' + getoldnumbers.replaceAll(',', ';') + ";"
      ws.send(newarray);
    }
    if (data.search("ROOMID`EMERALD`") != -1 && data.search("SEND-HOST-PLAYERBINGO") != -1) {
      get_message_sent = "EMERALD_PLAYERBINGO"
    }
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (get_message_sent == "EMERALD_HOSTRELAYCHATBOXTEXT") {
          //console.log('FROM`My`TO`HOST`ROOMID`EMERALD`SEND-ROOM-LOBBY-EXISTS`Message`')
          let myArray = data.split("FROM`");
          let myArray2 = myArray[1].split("TO`");
          let myArray3 = data.split("`Message`");
          let newarray = 'FROM`' + myArray2[0].replace('`', '') + '`TO`ALL`ROOMID`EMERALD`SEND-CLIENT-HOSTRELAYCHATBOXTEXT`Message`' + myArray3[1]
          client.send(newarray);
        }
        if (get_message_sent == "EMERALD_PLAYERBINGO") {
          //console.log('FROM`My`TO`HOST`ROOMID`EMERALD`SEND-ROOM-LOBBY-EXISTS`Message`')
          let myArray = data.split("FROM`");
          let myArray2 = myArray[1].split("TO`");
          let newarray = 'FROM`' + myArray2[0].replace('`', '') + '`TO`ALL`ROOMID`EMERALD`SEND-CLIENT-PLAYERBINGO`Message`' + myArray2[0].replace('`', '')
          emerald_player_has_bingo = 1
          emerald_pause_calling = 1
          client.send(newarray);
          setTimeout(function() {
            emerald_pause_calling = 0
          }, emerald_time_between_bingos * 1000)
        }
      }
    });
    //SAPPHIRE SERVER CODE
    if (data.search("ROOMID`SAPPHIRE`") != -1 && data.search("SEND-PING") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      var sapphire_players = sapphire_players_names.indexOf(myArray2[0].replace('`', ''))
      if (sapphire_players == -1) {
        sapphire_players_names.push(myArray2[0].replace('`', ''))
      }
    }
    if (data.search("ROOMID`SAPPHIRE`") != -1 && data.search("SEND-HOST-CHECKALLROOMS") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      let newarray = 'FROM`HOST`TO`' + myArray2[0].replace('`', '') + '`ROOMID`SAPPHIRE`SEND-ROOM-LOBBY-EXISTS`Message`'
      console.log(myArray2[0].replace('`', '') + " joined the SAPPHIRE server.");
      var sapphire_players = sapphire_players_names.indexOf(myArray2[0].replace('`', ''))
      if (sapphire_players == -1) {
        sapphire_players_names.push(myArray2[0].replace('`', ''))
      }
      ws.send(newarray);
    }
    if (data.search("ROOMID`SAPPHIRE`") != -1 && data.search("SEND-HOST-RELAYCHATBOXTEXT") != -1) {
      get_message_sent = "SAPPHIRE_HOSTRELAYCHATBOXTEXT"
    }
    if (data.search("ROOMID`SAPPHIRE`") != -1 && data.search("SEND-HOST-LEAVE") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      console.log(myArray2[0].replace('`', '') + " left the SAPPHIRE server.");
      var sapphire_players = sapphire_players_names.indexOf(myArray2[0].replace('`', ''));
      sapphire_players_names.splice(sapphire_players, 1)
    }
    if (data.search("ROOMID`SAPPHIRE`") != -1 && data.search("SEND-HOST-NEEDALLBINGONUMBERS") != -1) {
      //console.log('FROM`My`TO`HOST`ROOMID`SAPPHIRE`SEND-ROOM-LOBBY-EXISTS`Message`')
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      let getoldnumbers = sapphire_bingo_numbers_called.toString()
      let newarray = 'FROM`HOST`TO`' + myArray2[0].replace('`', '') + '`ROOMID`SAPPHIRE`SEND-CLIENT-ALLBINGONUMBERS`Message`' + getoldnumbers.replaceAll(',', ';') + ";"
      ws.send(newarray);
    }
    if (data.search("ROOMID`SAPPHIRE`") != -1 && data.search("SEND-HOST-PLAYERBINGO") != -1) {
      get_message_sent = "SAPPHIRE_PLAYERBINGO"
    }
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (get_message_sent == "SAPPHIRE_HOSTRELAYCHATBOXTEXT") {
          //console.log('FROM`My`TO`HOST`ROOMID`SAPPHIRE`SEND-ROOM-LOBBY-EXISTS`Message`')
          let myArray = data.split("FROM`");
          let myArray2 = myArray[1].split("TO`");
          let myArray3 = data.split("`Message`");
          let newarray = 'FROM`' + myArray2[0].replace('`', '') + '`TO`ALL`ROOMID`SAPPHIRE`SEND-CLIENT-HOSTRELAYCHATBOXTEXT`Message`' + myArray3[1]
          client.send(newarray);
        }
        if (get_message_sent == "SAPPHIRE_PLAYERBINGO") {
          //console.log('FROM`My`TO`HOST`ROOMID`SAPPHIRE`SEND-ROOM-LOBBY-EXISTS`Message`')
          let myArray = data.split("FROM`");
          let myArray2 = myArray[1].split("TO`");
          let newarray = 'FROM`' + myArray2[0].replace('`', '') + '`TO`ALL`ROOMID`SAPPHIRE`SEND-CLIENT-PLAYERBINGO`Message`' + myArray2[0].replace('`', '')
          sapphire_player_has_bingo = 1
          sapphire_pause_calling = 1
          client.send(newarray);
          setTimeout(function() {
            sapphire_pause_calling = 0
          }, sapphire_time_between_bingos * 1000)
        }
      }
    });
    //RUBY SERVER CODE
    if (data.search("ROOMID`RUBY`") != -1 && data.search("SEND-PING") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      var ruby_players = ruby_players_names.indexOf(myArray2[0].replace('`', ''))
      if (ruby_players == -1) {
        ruby_players_names.push(myArray2[0].replace('`', ''))
      }
    }
    if (data.search("ROOMID`RUBY`") != -1 && data.search("SEND-HOST-CHECKALLROOMS") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      let newarray = 'FROM`HOST`TO`' + myArray2[0].replace('`', '') + '`ROOMID`RUBY`SEND-ROOM-LOBBY-EXISTS`Message`'
      console.log(myArray2[0].replace('`', '') + " joined the RUBY server.");
      var ruby_players = ruby_players_names.indexOf(myArray2[0].replace('`', ''))
      if (ruby_players == -1) {
        ruby_players_names.push(myArray2[0].replace('`', ''))
      }
      ws.send(newarray);
    }
    if (data.search("ROOMID`RUBY`") != -1 && data.search("SEND-HOST-RELAYCHATBOXTEXT") != -1) {
      get_message_sent = "RUBY_HOSTRELAYCHATBOXTEXT"
    }
    if (data.search("ROOMID`RUBY`") != -1 && data.search("SEND-HOST-LEAVE") != -1) {
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      console.log(myArray2[0].replace('`', '') + " left the RUBY server.");
      var ruby_players = ruby_players_names.indexOf(myArray2[0].replace('`', ''));
      ruby_players_names.splice(ruby_players, 1)
    }
    if (data.search("ROOMID`RUBY`") != -1 && data.search("SEND-HOST-NEEDALLBINGONUMBERS") != -1) {
      //console.log('FROM`My`TO`HOST`ROOMID`RUBY`SEND-ROOM-LOBBY-EXISTS`Message`')
      let myArray = data.split("FROM`");
      let myArray2 = myArray[1].split("TO`");
      let getoldnumbers = ruby_bingo_numbers_called.toString()
      let newarray = 'FROM`HOST`TO`' + myArray2[0].replace('`', '') + '`ROOMID`RUBY`SEND-CLIENT-ALLBINGONUMBERS`Message`' + getoldnumbers.replaceAll(',', ';') + ";"
      ws.send(newarray);
    }
    if (data.search("ROOMID`RUBY`") != -1 && data.search("SEND-HOST-PLAYERBINGO") != -1) {
      get_message_sent = "RUBY_PLAYERBINGO"
    }
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (get_message_sent == "RUBY_HOSTRELAYCHATBOXTEXT") {
          //console.log('FROM`My`TO`HOST`ROOMID`RUBY`SEND-ROOM-LOBBY-EXISTS`Message`')
          let myArray = data.split("FROM`");
          let myArray2 = myArray[1].split("TO`");
          let myArray3 = data.split("`Message`");
          let newarray = 'FROM`' + myArray2[0].replace('`', '') + '`TO`ALL`ROOMID`RUBY`SEND-CLIENT-HOSTRELAYCHATBOXTEXT`Message`' + myArray3[1]
          client.send(newarray);
        }
        if (get_message_sent == "RUBY_PLAYERBINGO") {
          //console.log('FROM`My`TO`HOST`ROOMID`RUBY`SEND-ROOM-LOBBY-EXISTS`Message`')
          let myArray = data.split("FROM`");
          let myArray2 = myArray[1].split("TO`");
          let newarray = 'FROM`' + myArray2[0].replace('`', '') + '`TO`ALL`ROOMID`RUBY`SEND-CLIENT-PLAYERBINGO`Message`' + myArray2[0].replace('`', '')
          ruby_player_has_bingo = 1
          if (ruby_pause_calling == 0) {
            ruby_pause_calling = 1
            setTimeout(function() {
              ruby_pause_calling = 0
            }, ruby_time_between_bingos * 1000)
          }
          client.send(newarray);
        }
      }
    });
    console.log(data);
  });
});