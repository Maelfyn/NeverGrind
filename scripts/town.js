
//town.js

function refreshMerchantItems(count){
	if(count===undefined){ count=24; }
	var diffBonus = 0;
	if(g.difficulty===2){
		diffBonus = 25;
	}else if(g.difficulty===3){
		diffBonus = 44;
	}
	var merchantMax = 10;
	var z = myZone();
	if(z==="Aspen Grove"){
		merchantMax = 25;
	}else if(z==="Artremia"){
		merchantMax = 40;
	}else if(z==="Fenwoven"){
		merchantMax = 55;
	}
	merchantMax+=diffBonus;
	mob[0].level=merchantMax;
	var newItem = getItemSlot(merchantMax);
	var newTier = getItemTier(0);
	var foo = getArmor(0,newItem,newTier);
	var newArmor = foo[0];
	var newX = foo[1];
	var newY = foo[2];
	var newName = foo[3];
	var newDamage = foo[4];
	var newDelay = foo[5];
	var newType = foo[6];
	var newQuality = foo[7];
	var newRarity = 1;
	// magic or rare?
	if(M.random()*100 > 75){
		newRarity = 2;
	}
	//init store slot
	if((count+1) > P.item.length){
		P.item[count] = {};
		for(var x=0, len=g.key.length; x<len;x++){
			P.item[count][g.key[x]] = g.val[x];
		}
	}else{
		for(var x=0, len=g.key.length; x<len;x++){
			P.item[count][g.key[x]] = g.val[x];
		}
	}
	// basic assignments
	P.item[count].rarity=newRarity;
	P.item[count].itemSlot=newItem;
	P.item[count].xPos=newX;
	P.item[count].yPos=newY;
	P.item[count].name=newName;
	P.item[count].armor=newArmor;
	P.item[count].damage=newDamage;
	P.item[count].delay=newDelay;
	P.item[count].type=newType;
	P.item[count].quality=newQuality;
	if(newRarity===2){
		var prefCount = M.ceil(M.random()*3);
		var sufCount = M.ceil(M.random()*3);
		if(prefCount===1&&sufCount===1){ sufCount+=1; }
		for(var i=1;i<=prefCount;i++){
			getItemPrefix(count,newItem,newType,0,newName);
		}
		for(var i=1;i<=sufCount;i++){
			getItemSuffix(count,newItem,newType,0,newName);
		}
		P.item[count].name=getRareName(newItem,newType,newName);
	}
	if(newRarity===1){ //magic
		if(M.random()<=.5){
			getItemPrefix(count,newItem,newType,0,newName);
			if(M.random()>.5){
				getItemSuffix(count,newItem,newType,0,newName);
			}
		}else{
			getItemSuffix(count,newItem,newType,0,newName);
			if(M.random()<=.5){
				getItemPrefix(count,newItem,newType,0,newName);
			}
		}
	}
	//post processing
	if(P.item[count].enhancedDamage){
		P.item[count].damage += P.item[count].enhancedDamage;
	}
	if(P.item[count].enhancedArmor){
		P.item[count].armor = P.item[count].armor + M.round(P.item[count].armor*(P.item[count].enhancedArmor/100));
	}
	if(P.item[count].ias){
		P.item[count].delay = P.item[count].delay*(1-P.item[count].ias);
		P.item[count].delay = M.round(P.item[count].delay/100);
		P.item[count].delay *= 100;
		P.item[count].ias = M.round(P.item[count].ias*100);
	}
	updateCitySlot(count);
	if(count<=43){ refreshMerchantItems(++count); }
}

// city stuff
$("#cityWrap").on('click','#training',function(){
	cityMenuClick();
	var foo = $("#trainingOptions");
	if(foo.css("left")==="-700px"){
		foo.css("left",320);
		$("#trainOK").css("left",528);
	}
}).on('click','.trainingButton',function(){
	function flashThis(that){
		if(cityToggleStatus===true){
			that.style.border="1px solid #f00";
			cityToggleStatus = false;
		}else{
			that.style.border="1px solid #600";
			cityToggleStatus = true;
		}
		flashingCityBorder = T.delayedCall(.1, function(){ flashThis(that) });
	}
	var that = this;
	trainSkill = $(this).text();
	getTrainingCost();
	Chat(NPCname+' says, "Train '+trainSkill+' for '+cost+' gold?"');
	Chat2(NPCname+' says, "Train '+trainSkill+' for '+cost+' gold?"');
	var cityToggleStatus = true;
	flashingCityBorder.kill();
	$NG.trainingButton.css("border","1px solid #111");
	flashThis(that);
});
function getTrainingCost(){
	var X = trainSkill;
	if(X==="One-Hand Slashing"){ cost=my.oneHandSlash; }
	if(X==="Two-Hand Slashing"){ cost=my.twoHandSlash; }
	if(X==="One-Hand Blunt"){ cost=my.oneHandBlunt; }
	if(X==="Two-Hand Blunt"){ cost=my.twoHandBlunt; }
	if(X==="Piercing"){ cost=my.piercing; }
	if(X==="Hand to Hand"){ cost=my.handtohand; }
	if(X==="Offense"){ cost=my.offense; }
	if(X==="Dual Wield"){ cost=my.dualWield; }
	if(X==="Double Attack"){ cost=my.doubleAttack; }
	if(X==="Defense"){ cost=my.defense; }
	if(X==="Dodge"){ cost=my.dodge; }
	if(X==="Parry"){ cost=my.parry; }
	if(X==="Riposte"){ cost=my.riposte; }
	if(X==="Alteration"){ cost=my.alteration; }
	if(X==="Evocation"){ cost=my.evocation; }
	if(X==="Conjuration"){ cost=my.conjuration; }
	if(X==="Abjuration"){ cost=my.abjuration; }
	if(X==="Channeling"){ cost=my.channeling; }
	var kek = cost;
	cost=((cost*.7)+1);
	if(kek>50){ cost=cost+(cost*.25); }
	if(kek>100){ cost=cost+(cost*.25); }
	if(kek>150){ cost=cost+(cost*.25); }
	if(kek>200){ cost=cost+(cost*.25); }
	cost = ~~cost;
	trainSkillCost = cost;
}
function resetTalents(){
	for(var i=1;i<=12;i++){
		my['talent'+i]=0;
	}
	if(my.job==="Wizard"){
		updateIcebolt();
	}
	talentNotify();
	CStat();
	if(petName){
		slainPet();
	}
}
$("#cityWrap").on('click','#trainOK',function(){
	if(buttonLock===true){
		return;
	}
	function fail(){
		Error("You don't have enough gold.");
	}
	var X = trainSkill;
	if(X===""){
		Error("Select a skill to train first!");
		return;
	}
	if(my.gold < trainSkillCost){
		fail();
		return;
	}
	var foo;
	if(X==="One-Hand Slashing"){ foo=levelUp1hs(); }
	if(X==="Two-Hand Slashing"){ foo=levelUp2hs(); }
	if(X==="One-Hand Blunt"){ foo=levelUp1hb(); }
	if(X==="Two-Hand Blunt"){ foo=levelUp2hb(); }
	if(X==="Piercing"){ foo=levelUpPierce(); }
	if(X==="Hand to Hand"){ foo=levelUpH2h(); }
	if(X==="Offense"){ foo=levelUpOffense(); }
	if(X==="Dual Wield"){ foo=levelUpDualWield(); }
	if(X==="Double Attack"){ foo=levelUpDoubleAttack(); }
	if(X==="Defense"){ foo=levelUpDefense(); }
	if(X==="Dodge"){ foo=levelUpDodge(); }
	if(X==="Parry"){ foo=levelUpParry(); }
	if(X==="Riposte"){ foo=levelUpRiposte(); }
	if(X==="Alteration"){ foo=levelUpAlteration(); }
	if(X==="Evocation"){ foo=levelUpEvocation(); }
	if(X==="Conjuration"){ foo=levelUpConjuration(); }
	if(X==="Abjuration"){ foo=levelUpAbjuration(); }
	if(X==="Channeling"){ foo=levelUpChanneling(); }
	if(foo===false){
		Error("You cannot train that skill any higher right now.");
		return;
	}
	function doit(){
		playAudio("buyitem");
		Chat(('You spent '+trainSkillCost+' gold to train '+X+'.'),5);
		my.gold-=trainSkillCost;
		$("#inventoryGoldAmount").text(my.gold);
		$("#cityGold").html("<div id='goldIcon' class='goldIcon'></div> "+my.gold);
		CStat();
		save.my(); 
		getTrainingCost();
		Chat(NPCname+' says, "Train '+X+' for '+cost+' gold?"');
		Chat2(NPCname+' says, "Train '+X+' for '+cost+' gold?"');
	}
	buttonLock=true;
	$.ajax({
		url: '/classic/php/town1.php',
		data:{
			run:"trainSkill",
			cost:trainSkillCost,
			name:my.name
		}
	}).done(function(data){
		doit();
		buttonLock=false;
	}).fail(function(){
		failToCommunicate();
	});
}).on('click','#upgrade',function(){
	$("#upgradeOK").text("Ok");
	$("#upgradeCANCEL").text("Cancel");
	cityMenuClick();
	resetTalentPrompt=false;
	upgradeMode = true;
	upgradePrompt = false;
	upgradePhysical = true;
	$("#upgradeConfirm").css("left",350);
	$("#upgradePrompt").html("Upgrade An Item");
	$("#upgradeConfirm2").html("Select an item in your inventory. Weapons, cloth armor, leather armor, chain armor, plate armor, off-hand items, and shields may be upgraded.");
	if(inventoryToggle==1){	inventory(); }
}).on('click','#upgradeOK',function(){
	if(my.gold<cost){
		Error("You don't have enough gold.");
		cityMenuClick();
		return;
	}
	if(resetTalentPrompt===true){
		function do1(){
			my.gold-=cost;
			Chat(NPCname+" resets your talents for "+cost+" gold.",5);
			D.getElementById('cityGold').innerHTML="<div id='goldIcon' class='goldIcon'></div> "+my.gold;
			$('#inventoryGoldAmount').text(my.gold);
			resetTalents();
			playAudio("buyitem");
			$("#upgradeConfirm").css("left",-700);
			save.my();
		}
		g.lockScreen();
		$.ajax({
			url: '/classic/php/town1.php',
			data:{
				run:"resetTalents",
				cost:cost,
				name:my.name
			}
		}).done(function(data){
			var a = data.split("|");
			if(a[0]==='ok'){
				do1();
			}
			g.unlockScreen();
		}).fail(function(){
			failToCommunicate();
		});
		return;
	}
	if(upgradePrompt){
		upgradePhysical = true;
	}
	upgradeItem();
}).on('click','#upgradeCANCEL',function(){
	if(upgradePrompt){
		if(my.gold<cost){
			Error("You don't have enough gold.");
			cityMenuClick();
			return;
		}
		upgradePhysical=false;
		upgradeItem();
		return;
	}
	cityMenuClick();
	upgradeMode=false;
}).on('click','#merchant',function(){
	cityMenuClick();
	merchantMode = true;
	$("#merchantContainer").css("left",330);
	if(inventoryToggle==1){ inventory(); }
}).on('click','#sellOK',function(){
	sellItem();
}).on('click','#buyOK',function(){
	function do1(slot){
		buyMode=false;
		playAudio("buyitem");
		my.gold-=cost;
		D.getElementById('cityGold').innerHTML="<div id='goldIcon' class='goldIcon'></div> "+my.gold;
		$('#inventoryGoldAmount').text(my.gold);
		var baz = logItemName(P.item[dragSlot].name,P.item[dragSlot].rarity);
		Chat(('You purchased '+baz+' for '+cost+' gold.'),5);
		//copy item
		for(var x in P.item[dragSlot]){
			P.item[slot][x] = P.item[dragSlot][x];
		}
		updateInvDrop(slot);
		//clear image
		P.item[dragSlot].name="";
		P.item[dragSlot].xPos=0;
		P.item[dragSlot].yPos=0;
		updateCitySlot(dragSlot);
		//clear selected border
		cancelDragging();
		buyMode=false;
		save.item(slot);
	}
	if(buyMode){
		dropSlot = findFirstInvSlot();
		var slot = dropSlot;
		if(slot===false){
			Error("There is no room in your inventory.");
			return;
		}
		if(cost>my.gold){
			Error("You don't have enough gold.");
			return;
		}
		if(P.item[dragSlot].name){
			$.ajax({
				url: '/classic/php/town1.php',
				data:{
					run:"buyItem",
					cost:cost,
					name:my.name
				}
			}).done(function(data){
				do1(slot);
			});
		}
	}else{
		Error("You must select an item to buy first.");
	}
});
function upgradeItem(){
	var X = P.item[dragSlot];
	function completeUpgrade(){
		$("#campId").css("display","block");
		var bar = X.upgrade;
		var up1h = 0;
		var up2h = 0;
		var upRes = 0;
		var upArm = 0;
		var zag=true;
		if(bar===0){
			up1h = 1;
			up2h = 2;
			upRes = 1;
			upArm = 3;
		}
		if(bar===1){
			up1h = 1;
			up2h = 2;
			upRes = 1;
			upArm = 3;
		}
		if(bar===2){
			up1h = 1;
			up2h = 2;
			upRes = 1;
			upArm = 3;
		}
		if(bar===3){
			up1h = 1;
			up2h = 2;
			upRes = 1;
			upArm = 3;
		}
		if(bar===4){
			up1h = 1;
			up2h = 2;
			upRes = 1;
			upArm = 4;
		}
		if(bar===5){
			up1h = 1;
			up2h = 2;
			upRes = 1;
			upArm = 4;
		}
		if(bar===6){
			up1h = 2;
			up2h = 4;
			upRes = 2;
			upArm = 6;
		}
		if(bar===7){
			up1h = 2;
			up2h = 4;
			upRes = 2;
			upArm = 6;
		}
		if(bar===8){
			up1h = 2;
			up2h = 4;
			upRes = 2;
			upArm = 8;
		}
		if(bar===9){
			up1h = 3;
			up2h = 6;
			upRes = 3;
			upArm = 10;
		}
		var baz = logItemName(X.name,X.rarity);
		function upgradeSuccess(){
			my.gold-=cost;
			D.getElementById('cityGold').innerHTML="<div id='goldIcon' class='goldIcon'></div> "+my.gold;
			$('#inventoryGoldAmount').text(my.gold);
			if(zag===true){ // success
				g.unlockScreen();
				playAudio("upgrade");
				P.item[dragSlot].upgrade+=1;
				if(upgradePhysical){ //physical upgrade
					if(X.type==="slashed"||X.type==="crushed"||X.type==="pierced"||X.type==="offhand"){
						P.item[dragSlot].enhancePhysical = parseInt(X.enhancePhysical+up1h);
						Chat(NPCname+' says, "Success! '+ baz +' has been upgraded with +'+up1h+'% physical damage!"');
					}
					if(X.type==="cleaved"||X.type==="smashed"||X.type==="staff"){
						P.item[dragSlot].enhancePhysical = parseInt(X.enhancePhysical+up2h);
						Chat(NPCname+' says, "Success! '+ baz +' has been upgraded with +'+up2h+'% physical damage!"');
					}
				}else{ //magical upgrade
					if(X.enhanceAll===undefined||
						isNaN(X.enhanceAll)){ P.item[dragSlot].enhanceAll=0; }
					if(X.type==="slashed"||
					X.type==="crushed"||
					X.type==="pierced"||
					X.type==="offhand"){
						P.item[dragSlot].enhanceAll = parseInt(X.enhanceAll+up1h);
						Chat(NPCname+' says, "Success! '+ baz +' has been upgraded with +'+up1h+'% magical damage!"');
					}
					if(X.type==="cleaved"||
					X.type==="smashed"||
					X.type==="staff"){
						P.item[dragSlot].enhanceAll = parseInt(X.enhanceAll+up2h);
						Chat(NPCname+' says, "Success! '+ baz +' has been upgraded with +'+up2h+'% magical damage!"');
					}
				}
				if(X.type==="cloth"||
				X.type==="leather"||
				X.type==="chain"||
				X.type==="plate"||
				X.type==="shield"){
					P.item[dragSlot].allResist += upRes;
					var lel = M.round(X.armor*(upArm/100) );
					if(lel<1){ lel = 1; }
					P.item[dragSlot].armor += lel;
					Chat(NPCname+' says, "Success! I upgraded '+ baz +' with +'+lel+' armor and +'+upRes+' all resistances!"');
				}
				my.upgrades+=1;
				zoo.stop(true,true).css({display:"none",top:y1,left:x1});
				$("#blackOverlay").css("display","none");
				upgradeMsgUpdate();
				upgradePrompt=false;
				upgradePhysical=true;
			}
			save.item(dragSlot);
			save.my();
		}
		$.ajax({
			url: '/classic/php/town1.php',
			data:{
				run:"buyUpgrade",
				cost:cost,
				name:my.name
			}
		}).done(function(data){
			upgradeSuccess();
		});
		CStat();
		$("#upgradeOK").text("Ok");
		$("#upgradeCANCEL").text("Cancel");
	}
	if(!itemUpgradeMode){
		Error("You must select an item to upgrade first.");
		return;
	}
	if(X.upgrade>=10){
		Error("That item cannot be upgraded anymore.");
		cityMenuClick();
		return;
	}
	if(my.gold<cost){
		Error("You don't have enough gold.");
		return;
	}
	if($("#upgradeOK").text()==="Ok"&&(X.type==="slashed"||X.type==="crushed"||X.type==="pierced"||X.type==="cleaved"||X.type==="smashed"||X.type==="offhand"|| X.type==="staff")){
		upgradePrompt = true;
		$("#upgradeOK").text("Physical");
		$("#upgradeCANCEL").text("Magical");
		$("#upgradeConfirm2").html("Upgrade this weapon with physical or magical damage?");
		return;
	}
	if(X.type==="cloth"||
	X.type==="leather"||
	X.type==="chain"||
	X.type==="plate"||
	X.type==="slashed"||
	X.type==="crushed"||
	X.type==="pierced"||
	X.type==="cleaved"||
	X.type==="smashed"||
	X.type==="shield"||
	X.type==="offhand"||
	X.type==="staff"){
		var xi = ("You spent "+cost+" gold upgrading ").fontcolor("#00aa00");
		Chat(xi+logItemName(X.name,X.rarity)+".");
		$("#campId").css("display","none");
		g.lockScreen();
		var foo = $("#upgradeBar");
		foo.width(0);
		var x1 = 486;
		var y1 = 430;
		var zoo = $("#upgradeWrap");
		zoo.stop(true,true).css("display","block");
		var duration = 2000;
		function doit(kek){
			// make noises and bang bar around
			if(kek>(duration-500)){ return; }
			var zod = M.random();
			if(zod>.66){
				playAudio("repair");
			}else if(zod<.33){
				playAudio("shldblk");
			}else{
				playAudio("bashshld");
			}
			var qux = M.random()*(200)+(500-(X.upgrade*50));
			kek += qux;
			T.to(zoo, .1, {
				top:(y1+M.random()*(4)+2),left:(x1+M.random()*(6)-3),
				onComplete:function(){
					T.to(zoo, .1, {
						top:y1,
						left:x1
					});
				}
			});
			T.delayedCall(qux/1000, function(){
				doit(kek);
			});
		}
		doit(0);
		T.to(foo, 2, {
			width:300,
			onComplete:function(){
				completeUpgrade();
			}
		});
	}else{
		Error("That type of item cannot be upgraded.");
		cityMenuClick();
		upgradePrompt=false;
		upgradePhysical=true;
	}
}
function sellItem(){
	var x = $("#"+dragID);
	if(buyMode){
		Error("You can't sell the merchant's items.");
		return;
	}
	var z = P.item[dragSlot];
	if(z.name===''){
		cancelDragging();
		return;
	}
	if(dragStatus===false){
		Error("You must select an item to sell first.");
	}else{
		if(x.hasClass("bank")===true){
			Error("You cannot sell items from your bank.");
			return;
		}
		if(x.hasClass("equipment")===true){
			Error("You cannot sell items that you are wearing.");
			return;
		}
		if(x.hasClass("inventory")===true){
			function writeGold(){
				my.gold+=kek;
				if(my.gold>999999999){ my.gold=999999999; }
				$('#cityGold').html("<div id='goldIcon' class='goldIcon'></div> "+my.gold);
				$('#inventoryGoldAmount').text(my.gold);
				CStat();
			}
			var kek = itemSellValue(dragSlot);
			playAudio("buyitem");
			var baz = logItemName(z.name,z.rarity);
			Chat(('You sold '+baz+' for '+kek+' gold.'),5);
			$.ajax({
				url: '/classic/php/town1.php',
				data:{
					run:"sellItem",
					cost:kek,
					name:my.name
				}
			}).done(function(data){
				writeGold();
			});
			//destroy item
			cancelDragging();
			for(var x=0, len=g.key.length; x<len;x++){
				z[g.key[x]] = g.val[x];
			}
			updateInvDrag(dragSlot);
			save.item(dragSlot);
			NG.ttItem.style.display='none';
		}
	}
}
function itemSellValue(z){
	if(buyMode||z>23){
		var foo = 15;
	}else{
		var foo = 5;
	}
	if(P.item[z].enhancedDamage){ foo += P.item[z].enhancedDamage; }
	if(P.item[z].ias){ foo += P.item[z].ias; }
	if(P.item[z].armor){
		foo += P.item[z].armor*15;
	}
	if(P.item[z].itemSlot==="ring"||P.item[z].itemSlot==="amulet"){ foo+=100; }
	if(P.item[z].damage&&(P.item[z].type==="slashed"||P.item[z].type==="pierced"||P.item[z].type==="crushed")){ foo += P.item[z].damage*110; }
	if(P.item[z].damage&&(P.item[z].type==="cleaved"||P.item[z].type==="smashed"||P.item[z].type==="staff"||P.item[z].itemSlot==="range"||P.item[z].type==="offhand")){ foo += P.item[z].damage*55; }
	if(P.item[z].weight){ foo += 50; }
	if(P.item[z].hp){ foo += P.item[z].hp*15; }
	if(P.item[z].mp){ foo += P.item[z].mp*15; }
	if(P.item[z].str){ foo += P.item[z].str*15; }
	if(P.item[z].sta){ foo += P.item[z].sta*15; }
	if(P.item[z].agi){ foo += P.item[z].agi*15; }
	if(P.item[z].dez){ foo += P.item[z].dez*15; }
	if(P.item[z].intel){ foo += P.item[z].intel*15; }
	if(P.item[z].wis){ foo += P.item[z].wis*15; }
	if(P.item[z].cha){ foo += P.item[z].cha*15; }
	if(P.item[z].allStats){ foo += P.item[z].allStats*300; }
	if(P.item[z].hpRegen){ foo += P.item[z].hpRegen*25; }
	if(P.item[z].mpRegen){ foo += P.item[z].mpRegen*25; }
	if(P.item[z].attack){ foo += P.item[z].attack*40; }
	if(P.item[z].oneHandSlash){ foo += P.item[z].oneHandSlash*50; }
	if(P.item[z].twoHandSlash){ foo += P.item[z].twoHandSlash*50; }
	if(P.item[z].oneHandBlunt){ foo += P.item[z].oneHandBlunt*50; }
	if(P.item[z].twoHandBlunt){ foo += P.item[z].twoHandBlunt*50; }
	if(P.item[z].piercing){ foo += P.item[z].piercing*50; }
	if(P.item[z].handtohand){ foo += P.item[z].handtohand*50; }
	if(P.item[z].offense){ foo += P.item[z].offense*50; }
	if(P.item[z].dualWield){ foo += P.item[z].dualWield*50; }
	if(P.item[z].doubleAttack){ foo += P.item[z].doubleAttack*50; }
	if(P.item[z].defense){ foo += P.item[z].defense*50; }
	if(P.item[z].dodge){ foo += P.item[z].dodge*50; }
	if(P.item[z].parry){ foo += P.item[z].parry*50; }
	if(P.item[z].riposte){ foo += P.item[z].riposte*50; }
	if(P.item[z].alteration){ foo += P.item[z].alteration*50; }
	if(P.item[z].evocation){ foo += P.item[z].evocation*50; }
	if(P.item[z].conjuration){ foo += P.item[z].conjuration*50; }
	if(P.item[z].abjuration){ foo += P.item[z].abjuration*50; }
	if(P.item[z].channeling){ foo += P.item[z].channeling*50; }
	if(P.item[z].allSkills){ foo += P.item[z].allSkills*1000; }
	if(P.item[z].critChance){ foo += P.item[z].critChance*200; }
	if(P.item[z].critDamage){ foo += P.item[z].critDamage*100; }
	if(P.item[z].phyMit){ foo += P.item[z].phyMit*10; }
	if(P.item[z].magMit){ foo += P.item[z].magMit*10; }
	if(P.item[z].resistPoison){ foo += P.item[z].resistPoison*20; }
	if(P.item[z].resistMagic){ foo += P.item[z].resistMagic*20; }
	if(P.item[z].resistLightning){ foo += P.item[z].resistLightning*20; }
	if(P.item[z].resistCold){ foo += P.item[z].resistCold*20; }
	if(P.item[z].resistFire){ foo += P.item[z].resistFire*20; }
	if(P.item[z].allResist){ foo += P.item[z].allResist*300; }
	if(P.item[z].goldFind){ foo += P.item[z].goldFind*10; }
	if(P.item[z].expFind){ foo += P.item[z].expFind*10; }
	if(P.item[z].thorns){ foo += P.item[z].thorns*10; }
	if(P.item[z].absorbPoison){ foo += P.item[z].absorbPoison*50; }
	if(P.item[z].absorbMagic){ foo += P.item[z].absorbMagic*50; }
	if(P.item[z].absorbLightning){ foo += P.item[z].absorbLightning*50; }
	if(P.item[z].absorbCold){ foo += P.item[z].absorbCold*50; }
	if(P.item[z].absorbFire){ foo += P.item[z].absorbFire*50; }
	if(P.item[z].hpKill){ foo += P.item[z].hpKill*10; }
	if(P.item[z].mpKill){ foo += P.item[z].mpKill*10; }
	if(P.item[z].physicalDamage){ foo += P.item[z].physicalDamage*10; }
	if(P.item[z].poisonDamage){ foo += P.item[z].poisonDamage*10; }
	if(P.item[z].magicDamage){ foo += P.item[z].magicDamage*10; }
	if(P.item[z].lightningDamage){ foo += P.item[z].lightningDamage*10; }
	if(P.item[z].coldDamage){ foo += P.item[z].coldDamage*10; }
	if(P.item[z].fireDamage){ foo += P.item[z].fireDamage*10; }
	if(P.item[z].enhancePhysical){ foo += P.item[z].enhancePhysical*100; }
	if(P.item[z].enhancePoison){ foo += P.item[z].enhancePoison*200; }
	if(P.item[z].enhanceMagic){ foo += P.item[z].enhanceMagic*200; }
	if(P.item[z].enhanceLightning){ foo += P.item[z].enhanceLightning*200; }
	if(P.item[z].enhanceCold){ foo += P.item[z].enhanceCold*200; }
	if(P.item[z].enhanceFire){ foo += P.item[z].enhanceFire*200; }
	if(P.item[z].enhanceAll){ foo += P.item[z].enhanceAll*100; }
	if(P.item[z].lightRadius){ foo += P.item[z].lightRadius*5; }
	if(P.item[z].fear){ foo += P.item[z].fear*10; }
	if(P.item[z].stun){ foo += P.item[z].stun*10; }
	if(P.item[z].cold){ foo += P.item[z].cold*10; }
	if(P.item[z].silence){ foo += P.item[z].silence*10; }
	if(P.item[z].leech){ foo += P.item[z].leech*50; }
	if(P.item[z].wraith){ foo += P.item[z].wraith*50; }
	if(P.item[z].runSpeed){ foo += P.item[z].runSpeed; }
	if(P.item[z].haste){
		var bar = (P.item[z].haste/10)*-1;
		foo += bar*100;
	}
	if(P.item[z].globalHaste){
		var bar = (P.item[z].globalHaste/10)*-1;
		foo += bar*100;
	}
	if(P.item[z].castingHaste){
		var bar = (P.item[z].castingHaste/10)*-1;
		foo += bar*100;
	}
	if(P.item[z].proc){
		foo += 200;
	}
	var zog = chaTotal();
	if(z>23){
		foo = M.round(foo - (foo*(zog/1600)) );
	}
	if(z<=23){
		if(P.item[z].rarity===3){ foo = (foo/4); }
		foo = (foo/8);
		foo = M.round(foo + (foo*(zog/1600)) );
		if(foo>(250+(my.level*15))){ foo = (250+(my.level*15)); }
	}
	return M.ceil(foo/4);
}
$("#cityWrap").on('click','#exitCity',function(){
	cityMenuClick();
	Chat(NPCname+' says, "Thank you for stopping by, '+my.name+'. Be sure to check our wares after our next shipment arrives.');
	$("#cityWindow").css("left",-700);
});
$("#cityWrap").on('click','#cityNPC',function(){
	cityMenuClick();
	Chat(NPCname+' says, "Hello, '+my.name+'. How can I help you?"');
	$("#cityWindow").css("left",10);
});

/* pay for bank slots */

var card = {
	init: function() {
		if (location.host === 'localhost') {
			Stripe.setPublishableKey('pk_test_GtNfTRB1vYUiMv1GY2kSSRRh');
		}
		else {
			Stripe.setPublishableKey('pk_live_rPSfoOYjUrmJyQYLnYJw71Zm');
		}
		// init
		$("#last-credit-card").css({
			background: '#777',
			border: '2px ridge #aaa'
		}).data('oldcard', 'false');
		$("#newCard").css({
			display: 'block',
		});
		$("#payment-form").css('display', 'block');
		$("#card-number").focus();
		if ($("#old-cards").css('display') === 'block') {
			$("#last-credit-card").trigger('click');
		}
		this.checkKnownCC();
		this.events();
	},
	getFormHtml: function() {
		return [
			'<div style="padding-top: 1rem; display: flex; justify-content: center">',
				'<img src="/images/neverworks-txt.png">',
			'</div>',
			'<p class="centerize">',
				'Purchase bank slots to share your items with other characters on your account!',
			'</p>',
			'<div id="old-cards" class="strongShadow">',
				'<hr class="fancyHR">',
				'<div id="last-credit-card" class="noSelect" data-oldcard="false">Use credit card: **** **** **** <span id="CC-last-four">****</span></div>',
				'<div class="centerize">',
					'<button id="deleteCards" class="NGgradient strongShadow">Delete Card</button>',
				'</div>',
			'</div>',
			'<div id="newCard">',
				'<hr class="fancyHR">',
				'<p>',
					'<div>Card Number (no spaces or hyphens)</div>',
					'<input id="card-number" type="text" size="20" maxlength="16" autocomplete="off">',
				'</p>',
				'<p>',
					'<div>CVC (number on the back of your credit card)</div>',
					'<input id="card-cvc" type="text" size="4" maxlength="4" autocomplete="off">',
				'</p>',
				'<p>',
					'<div>Expiration Month/Year (MM/YYYY)</div>',
					'<input id="card-month" type="text" size="2" maxlength="2"> /',
					'<input id="card-year" type="text" size="4" maxlength="4">',
				'</p>',
				'<p>',
					'<input id="rememberCard" type="checkbox" checked><label for="rememberCard">Remember me</label>',
				'</p>',
			'</div>',
			'<hr class="fancyHR">',
			'<div id="crystalWrap" class="strongShadow">',
				'<div data-amount="100" class="floater purchase">',
					'$1',
				'</div>',
				'<div data-amount="500" class="floater">',
					'$5',
				'</div>',
				'<div data-amount="1000" class="floater">',
					'$10',
				'</div>',
			'</div>',
			'<div id="crystalsExplained">$1 will purchase 10 bank slots (1 row)</div>',
			'<div id="payment-errors" class="red"></div>',
			'<div class="centerize">',
				'<button id="payment-confirm" class="NGgradient strongShadow">Submit</button>',
			'</div>',
		].join('');
	},
	formWrap: document.querySelector('#payment-form-wrap'),
	form: document.querySelector('#payment-form'),
	openPaymentModal: function() {
		this.form.style.display = 'block';
		this.formWrap.style.display = 'block';
		TweenMax.to([this.formWrap, this.form], .3, {
			startAt: { opacity: 0 },
			opacity: 1
		});
		TweenMax.to(this.form, .8, {
			startAt: { y: -50 },
			y: 0
		})
		this.form.innerHTML = this.getFormHtml();
		this.init();
	},
	closePaymentModal: function() {
		TweenMax.to([this.formWrap, this.form], .2, {
			opacity: 0,
			onComplete: function() {
				card.form.style.display = 'none';
				card.formWrap.style.display = 'none';
				card.form.innerHTML = '';
			}
		});
	},
	checkKnownCC: function() {
		// check known cards
		$.ajax({
			type: 'POST',
			url: '/php/master1.php',
			data: {
				run: "checkCC"
			}
		}).done(function(data) {
			if (data !== "cardNotFound") {
				$('#CC-last-four').text(data);
				$('#old-cards').css({
					display: 'block'
				});
				$("#last-credit-card").trigger("click");
			}
			$("#payment-form").css('visibility', 'visible');
		});
	},
	events: function() {
		// events
		$('#payment-form-wrap').off().on('click', function() {
			card.closePaymentModal();
		});
		$("#last-credit-card").on('click', function() {
			$("#card-number, #card-cvc, #card-month, #card-year").val("");
			$("#payment-errors").text("");
			if ($(this).data('oldcard') === "false") {
				$(this).css({
					background: '#080',
					border: '2px ridge #0d0'
				}).data('oldcard', 'true');
				$("#newCard").css('display', 'none');
				$("#rememberCard").prop("checked", false);
			} else {
				$(this).css({
					background: '#777',
					border: '2px ridge #aaa'
				}).data('oldcard', 'false');
				$("#newCard").css('display', 'block');
				$("#rememberCard").prop("checked", true);
			}
		});
		$(".floater").on('click', function() {
			var e = document.getElementsByClassName('floater');
			for (var i = 0; i < e.length; i++) {
				e[i].className = "floater";
			}
			this.className += " purchase";
			var amount = parseInt($(".purchase").data('amount'), 10);
			var e1 = document.getElementById('crystalsExplained');
			if (amount === 1000) {
				e1.textContent = "$10 will purchase 270 bank slots (3 tabs)";
			}
			else if (amount === 500) {
				e1.textContent = "$5 will purchase 90 bank slots (1 tab)";
			}
			else {
				e1.textContent = "$1 will purchase 10 bank slots (1 row)";
			}
		});
		$("#deleteCards").on('click', function() {
			var that = $(this);
			g.lockScreen();
			that.text("Deleting...");
			$.ajax({
				data: {
					run: "deleteCards"
				}
			}).done(function(data) {
				card.msg("All customer card data has been deleted.");
				$("#last-credit-card").data("oldcard", "false");
				$('#CC-last-four').text("****");
				$('#old-cards').css({
					display: 'none'
				});
				that.text("Delete Card");
				$("#newCard").css('display', 'block');
				g.unlockScreen();
			}).fail(function() {
				card.msg("Failed to communicate with the server!");
			});
		});

		$("#payment-confirm").on('click', function() {
			g.lockScreen();
			card.clickLastBankTab();
			// get data
			var ccNum = $('#card-number').val(),
				cvcNum = $('#card-cvc').val(),
				expMonth = $('#card-month').val(),
				expYear = $('#card-year').val(),
				oldcard = $("#last-credit-card").data("oldcard"),
				error = false;
			var lastFour = ccNum.slice(12);
			// Validate the number:
			if (oldcard === "true") {
				document.getElementById('payment-errors').textContent = '';
				stripeResponseHandler('Using old card', {
					id: "oldCard"
				});
			}
			else {
				if (!Stripe.validateCardNumber(ccNum)) {
					error = true;
					card.reportError('The credit card number appears to be invalid.');
				}
				// Validate the CVC:
				if (!Stripe.validateCVC(cvcNum)) {
					error = true;
					card.reportError('The CVC number appears to be invalid.');
				}
				// Validate the expiration:
				if (!Stripe.validateExpiry(expMonth, expYear)) {
					error = true;
					card.reportError('The expiration date appears to be invalid.');
				}
				if (!error) {
					createToken();
				}
			}

			function createToken() {
				Stripe.createToken({
					number: ccNum,
					cvc: cvcNum,
					exp_month: expMonth,
					exp_year: expYear
				}, stripeResponseHandler);
				card.msg('');
			}

			function stripeResponseHandler(status, response) {
				if (response.error) {
					card.reportError(response.error.message);
				}
				else {
					// No errors, submit the form.
					var amount = parseInt($(".purchase").data('amount'), 10);
					var crystals = 0;
					if (amount > 1000) {
						amount = 1000;
					}
					if (amount < 100) {
						amount = 100;
					}
					var valid = false;
					if (amount === 100) {
						valid = true;
						crystals = 70;
					}
					if (amount === 500) {
						valid = true;
						crystals = 400;
					}
					if (amount === 1000) {
						valid = true;
						crystals = 1000;
					}
					var rememberMe = "false";
					if ($("#rememberCard").prop('checked') === true) {
						rememberMe = "true";
					}
					if (valid === true) {
						card.msg("Communicating with the server...");
						$.ajax({
							type: 'POST',
							url: '/php/unlock-bank.php',
							data: {
								stripeToken: response.id,
								amount: amount,
								crystals: crystals,
								lastFour: lastFour,
								oldcard: oldcard,
								rememberMe: rememberMe
							}
						}).done(function(data) {
							var a = data.split("|");
							if (a[0] === "Error") {
								card.msg(a[1]);
							}
							else {
								if (amount === 1000) {
									card.msg("You have spent $10 on 270 bank slots");
								}
								else if (amount === 500) {
									card.msg("You have spent $5 on 90 bank slots");
								}
								else {
									card.msg("You have spent $1 on 10 bank slots");
								}
								QMsg("Bank Slots Available: " + data);
								// render
								playAudio("buyitem");
								cancelMySpell();
								bankToggle();
								setTimeout(function() {
									card.clickLastBankTab();
								}, 250);
								g.unlockScreen();
							}
						}).fail(function(data) {
							console.info(data);
							card.msg("Error: " + data.statusText);
						}).always(function(){
							g.unlockScreen();
						});
					}
				}
			}
		});
	},
	clickLastBankTab: function() {
		// click the last active tab
		var els = $("#bankTabWrap").children('.bankTab:not(.bankTabLocked)'),
			len = els.length;
		$(els[len-1]).trigger('click');
	},
	msg: function(msg) {
		var e = $("#payment-errors");
		e.text(msg);
		/*TweenMax.set(e, {
			transformPerspective: 300,
			transformOrigin: '50% 0'
		});
		TweenMax.killTweensOf(e);
		TweenMax.fromTo(e, 2, {
			rotationX: 0,
			height: "auto"
		}, {
			rotationX: -90,
			delay: 8,
			height: 0,
			onComplete: function(){
				e.text("");
			}
		});*/
	},
	reportError: function(msg) {
		card.msg(msg);
		g.unlockScreen();
	},
};