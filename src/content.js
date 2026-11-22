/* ===== Maintenance Relay – game content (English) ===== */

/* ---------- Line drawings (original, 100x100) ---------- */
const PIC = {
  spark:`<rect x="44" y="5" width="12" height="9" rx="2"/><path d="M41 14h18l-2 28H43z"/><path d="M45 21h10M45 28h10M45 35h10"/><path d="M33 42h34v12H33z"/><path d="M42 42v12M58 42v12"/><path d="M40 54h20v24H40z"/><path d="M40 60l20 4M40 66l20 4M40 72l20 4"/><path d="M50 78v9h9v-5"/>`,
  prop:`<path class="a" d="M50 44C40 32 38 16 46 6c8 2 10 22 8 38z"/><path class="a" d="M50 56c10 12 12 28 4 38-8-2-10-22-8-38z"/><circle cx="50" cy="50" r="9"/><circle class="f" cx="50" cy="50" r="3"/>`,
  tyre:`<circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="8"/><path d="M50 8v8M50 84v8M8 50h8M84 50h8M21 21l6 6M73 73l6 6M79 21l-6 6M21 79l6-6"/><path d="M50 22v20M50 58v20M22 50h20M58 50h20"/>`,
  brake:`<circle cx="44" cy="50" r="38"/><circle cx="44" cy="50" r="13"/><circle cx="44" cy="24" r="3"/><circle cx="44" cy="76" r="3"/><circle cx="18" cy="50" r="3"/><circle cx="25" cy="31" r="3"/><circle cx="25" cy="69" r="3"/><path class="a" d="M70 28h14a4 4 0 0 1 4 4v36a4 4 0 0 1-4 4H70z"/>`,
  oilf:`<path d="M34 20v-8h32v8"/><rect x="26" y="20" width="48" height="66" rx="7"/><path d="M36 30v46M45 30v46M55 30v46M64 30v46"/>`,
  batt:`<rect x="14" y="30" width="72" height="50" rx="4"/><rect x="24" y="20" width="12" height="10"/><rect x="64" y="20" width="12" height="10"/><path d="M25 54h12M31 48v12M63 54h12"/>`,
  alt:`<circle cx="50" cy="56" r="34"/><circle cx="50" cy="56" r="26" stroke-dasharray="6 6"/><path class="f" d="M55 34 38 60h11l-4 18 19-28H53z"/><rect x="42" y="10" width="16" height="12" rx="3"/>`,
  carb:`<rect x="24" y="14" width="52" height="56" rx="4"/><path d="M38 14c0 18 8 20 8 28s-8 10-8 28M62 14c0 18-8 20-8 28s8 10 8 28"/><path d="M41 31l18 6"/><path d="M76 34h12v14H76"/><path d="M40 70v14h20V70"/>`,
  pitot:`<path d="M6 26h88" stroke-width="7"/><path d="M40 26v32a8 8 0 0 0 8 8h40" stroke-width="10"/><circle class="f" cx="90" cy="66" r="3"/>`,
  mag:`<rect x="22" y="44" width="56" height="42" rx="6"/><path d="M30 44V32M42 44V26M58 44V26M70 44V32"/><path d="M30 32C30 22 40 14 50 12M42 26c0-6 4-12 8-14M58 26c0-6-4-12-8-14M70 32C70 22 60 14 50 12"/><path class="f" d="M54 52 42 68h8l-3 12 13-18h-8z"/>`,
  strainer:`<rect x="28" y="12" width="44" height="16" rx="3"/><path d="M12 20h16M72 20h16"/><path d="M32 28v30a18 18 0 0 0 36 0V28"/><path d="M32 46h36" opacity=".45"/><path d="M50 76v8"/><path class="a" d="M50 86q-6 7 0 10q6-3 0-10z"/>`,
  light:`<path d="M28 20a30 30 0 0 1 0 60z"/><circle class="a" cx="38" cy="50" r="8"/><path d="M70 50h22M66 32l20-10M66 68l20 10"/>`,
  /* rebus pictures */
  fire:`<path class="a" d="M50 92c-20 0-30-14-28-30 2-14 14-20 12-38 14 8 20 20 18 30 4-4 6-10 6-16 10 10 14 22 12 32-2 14-10 22-20 22z"/><path d="M50 92c-8 0-12-6-11-12 1-6 6-9 6-16 6 4 9 9 8 14 3-2 4-5 4-7 4 4 5 9 4 13-1 5-5 8-11 8z"/>`,
  wall:`<rect x="10" y="20" width="80" height="64"/><path d="M10 36h80M10 52h80M10 68h80"/><path d="M36 20v16M64 20v16M22 36v16M50 36v16M78 36v16M36 52v16M64 52v16M22 68v16M50 68v16M78 68v16"/>`,
  padlock:`<path d="M32 46V32a18 18 0 0 1 36 0v14"/><rect class="a" x="22" y="46" width="56" height="44" rx="6"/><circle class="f" cx="50" cy="63" r="5"/><path d="M50 66v11"/>`,
  nut:`<path class="a" d="M50 14l31 18v36L50 86 19 68V32z"/><circle cx="50" cy="50" r="14"/>`,
  axe:`<path d="M28 92 66 24" stroke-width="7"/><path class="a" d="M56 16c10-10 28-8 36 2-8 4-12 14-10 28-10-2-20-12-26-30z"/>`,
  pumpkin:`<path class="a" d="M50 30c-30 0-40 16-40 32s14 28 40 28 40-12 40-28-10-32-40-32z"/><path d="M50 30c-10 0-14 18-14 30s4 30 14 30M50 30c10 0 14 18 14 30s-4 30-14 30"/><path d="M50 30c0-8 4-14 10-18"/>`,
  burst:`<path class="a" d="M50 6l8 30 30-8-22 22 22 22-30-8-8 30-8-30-30 8 22-22-22-22 30 8z"/>`,
  eplug:`<rect class="a" x="28" y="34" width="44" height="36" rx="8"/><path d="M40 34V14M60 34V14"/><path d="M50 70v10c0 8-10 10-20 10"/>`
};
const pic = (k, cls='') => `<svg class="ico ${cls}" viewBox="0 0 100 100" aria-hidden="true">${PIC[k]}</svg>`;

/* ---------- Round 1: parts and scenario cards ---------- */
const PARTS = {
  spark:{name:'Spark plug'}, prop:{name:'Propeller'}, tyre:{name:'Tyre'}, brake:{name:'Brake disc'},
  oilf:{name:'Oil filter'}, batt:{name:'Battery'}, alt:{name:'Alternator'}, carb:{name:'Carburettor'},
  pitot:{name:'Pitot tube'}, mag:{name:'Magneto'}, strainer:{name:'Fuel strainer'}, light:{name:'Landing light'}
};
const PART_KEYS = Object.keys(PARTS);

const CARDS = [
  {part:'spark', text:'During the run-up the engine runs rough. You remove a part from cylinder 3 and find black lead deposits on its electrodes. You clean it, re-gap it with a feeler gauge and torque it back in.', taboo:['spark','plug','ignition']},
  {part:'prop', text:'On the walk-around you find a small nick on the leading edge of a blade, near the tip. You dress it with a file, check the track and write it in the logbook.', taboo:['propeller','prop','blade']},
  {part:'tyre', text:'The aircraft pulls on taxi. On a main wheel you can see the cords through the rubber on one side. You jack the aircraft, deflate, demount and fit a new one, then inflate to the correct pressure.', taboo:['tyre','tire','rubber','wheel']},
  {part:'brake', text:'After a long taxi with heavy braking, the pilot smells burning. On one main wheel the metal disc is blue and has a deep groove. You measure its thickness: below the minimum. It must be replaced with new linings.', taboo:['brake','disc','stop']},
  {part:'oilf', text:'At the 50-hour inspection you drain the engine. You cut open the old canister and look for metal particles in the pleated paper. You fit a new one, torque it and safety-wire it.', taboo:['oil','filter']},
  {part:'batt', text:'On a cold morning the starter turns very slowly, then just clicks. You measure 10.5 volts. You remove the unit from its box behind the firewall, charge it and clean the terminals.', taboo:['battery','power','cell']},
  {part:'alt', text:'In flight the ammeter shows a discharge and the low-voltage light comes on. On the ground you find a loose, worn belt that drives a unit at the front of the engine. You replace the belt and set the tension.', taboo:['alternator','generator','electricity']},
  {part:'carb', text:'The engine lost power in descent on a humid day at 10 °C. The pilot did not pull the heat control. On the ground you check the heat box flap and the unit where fuel and air are mixed, under the engine.', taboo:['carburettor','carb','ice','icing']},
  {part:'pitot', text:'The airspeed indicator showed zero after take-off. You find a wasp nest blocking a small tube under the left wing. You clean it and test the system with a leak tester. Remind pilots to use the cover!', taboo:['pitot','airspeed','tube']},
  {part:'mag', text:'The RPM drop on the left side is 250 rpm, above the limit. You check the timing of the self-powered unit at the back of the engine that sends high voltage to the plugs, and find worn points.', taboo:['magneto','mag','ignition']},
  {part:'strainer', text:'During the pre-flight check the pilot finds water and dirt in the sample. In the engine compartment, at the lowest point of the system, you clean a bowl and its screen, then replace the gasket.', taboo:['fuel','strainer','gascolator','drain']},
  {part:'light', text:'Before a night flight the pilot reports that the lamp in the wing or cowling doesn’t work. You check the circuit breaker, then the bulb: the filament is broken. You replace it and check the aim.', taboo:['landing','light','lamp']}
];

/* ---------- Round 2: technical trivia (visuals 200x140) ---------- */
function planeTop(h){
  const c = k => k===h ? 'hl' : '';
  return `<path d="M20 50h160v18H20z"/>
  <rect class="${c('ail')}" x="22" y="62" width="40" height="6"/><rect class="${c('ail')}" x="138" y="62" width="40" height="6"/>
  <rect class="${c('flap')}" x="66" y="62" width="24" height="6"/><rect class="${c('flap')}" x="110" y="62" width="24" height="6"/>
  <path class="bg" d="M100 8c8 0 10 14 10 30v72l6 4v4H84v-4l6-4V38c0-16 2-30 10-30z"/>
  <path d="M68 112h64v8H68z"/><rect class="${c('elev')}" x="70" y="120" width="60" height="5"/>
  <path d="M94 4h12" stroke-width="5"/>
  ${h==='ail'?'<path class="arr" d="M42 100V76M36 82l6-6 6 6"/>':''}
  ${h==='flap'?'<path class="arr" d="M78 100V76M72 82l6-6 6 6"/>':''}`;
}
function planeSide(){
  return `<path class="bg" d="M22 76c0-12 18-18 40-18h36l58-6 14-32h10l-2 40-2 6H62c-22 0-40-0-40-12z"/>
  <path class="hl" d="M168 22l12-2-2 38-12 0z"/>
  <path d="M60 58l20-14h30l10 14"/><path d="M14 52v44" stroke-width="5"/><path d="M50 82l-6 22M50 104h-10"/><circle cx="44" cy="108" r="6"/><circle cx="112" cy="108" r="7"/><path d="M110 82l2 18"/>
  <path class="arr" d="M150 112l18-46M160 70l8-4 2 9"/>`;
}
function gauge(kind){
  let s = `<circle cx="100" cy="70" r="62"/><circle cx="100" cy="70" r="4" class="f"/>`;
  if(kind==='alt'){
    for(let i=0;i<10;i++){const a=(i*36-90)*Math.PI/180; s+=`<text x="${100+48*Math.cos(a)}" y="${70+48*Math.sin(a)+5}" text-anchor="middle" class="gt">${i}</text>`;}
    s+=`<rect x="122" y="62" width="30" height="16" rx="2"/><text x="137" y="74" text-anchor="middle" class="gs">1013</text>`;
    s+=`<path d="M100 70 100 26" stroke-width="3"/><path d="M100 70 128 52" stroke-width="6"/><path d="M100 70 78 86" stroke-width="2"/><text x="100" y="104" text-anchor="middle" class="gs">ALT</text>`;
  } else {
    s+=`<path class="grn" d="M60 112 A56 56 0 0 1 132 26" />`;
    for(let i=0;i<=7;i++){const a=(135+i*38.5)*Math.PI/180; s+=`<text x="${100+46*Math.cos(a)}" y="${70+46*Math.sin(a)+5}" text-anchor="middle" class="gt">${i*5}</text>`;}
    s+=`<path d="M100 70 132 40" stroke-width="4"/><text x="100" y="108" text-anchor="middle" class="gs">RPM ×100</text>`;
  }
  return s;
}
const VIZ = {
  ail: () => planeTop('ail'), flap: () => planeTop('flap'), rud: planeSide,
  alt: () => gauge('alt'), tach: () => gauge('tach'),
  torque: () => `<rect x="18" y="62" width="130" height="16" rx="8"/><circle cx="164" cy="70" r="16"/><rect class="f" x="159" y="64" width="10" height="12"/><path d="M60 62v-8M70 62v-5M80 62v-8M90 62v-5M100 62v-8"/><text x="80" y="44" text-anchor="middle" class="gs">Nm</text>`,
  wire: () => `<path class="a" d="M60 48l19 11v22L60 92 41 81V59z"/><path class="a" d="M140 48l19 11v22l-19 11-19-11V59z"/><path d="M68 56l9 8 9-8 9 8 9-8 9 8 9-8 9 8" stroke-width="3"/><path d="M68 64l9-8 9 8 9-8 9 8 9-8 9 8 9-8" stroke-width="3" opacity=".6"/>`,
  feeler: () => { let s=''; for(let i=0;i<6;i++){ s+=`<rect class="${i===2?'a':''}" x="40" y="104" width="130" height="10" rx="5" transform="rotate(${-58+i*10} 44 109)"/>`; } return s+`<circle cx="44" cy="109" r="8" class="f"/>`; },
  cotter: () => `<rect class="bg" x="88" y="14" width="24" height="112"/><path d="M88 30h24M88 40h24M88 100h24M88 110h24" opacity=".5"/><rect class="a" x="64" y="64" width="72" height="30"/><path d="M64 64V50h14v14M93 64V50h14v14M122 64V50h14v14"/><path class="hl2" d="M44 54h92c10 0 10 8 0 8H52" stroke-width="4"/><path d="M136 54c10 2 16 12 18 26M136 62c6 2 10 12 12 24" stroke-width="3"/>`,
  piston: () => `<path d="M60 18v84M140 18v84M60 18h80"/><rect class="a" x="64" y="56" width="72" height="28" rx="3"/><path d="M100 72 92 116"/><circle cx="100" cy="120" r="14"/><path d="M80 18v14l-8 4h16zM120 18v14l-8 4h16z"/><path d="M100 18V6M96 6h8"/>`,
  jar: () => `<path d="M76 24h48v6l-4 4v80a8 8 0 0 1-8 8H88a8 8 0 0 1-8-8V34l-4-4z"/><path d="M80 66h40" opacity=".5"/><text x="100" y="104" text-anchor="middle" class="gq">?</text>`,
  creep: () => `<circle cx="100" cy="70" r="58"/><circle cx="100" cy="70" r="36"/><circle cx="100" cy="70" r="10"/><rect class="mk" x="96" y="12" width="8" height="22"/><rect class="mk" x="96" y="36" width="8" height="14"/>`
};
const viz = k => `<svg class="viz" viewBox="0 0 200 140" aria-hidden="true">${VIZ[k]()}</svg>`;

const TRIVIA = [
  {q:'What is this control surface called?', v:'ail', o:['Aileron','Elevator','Rudder','Flap'], a:0, ex:'Ailerons are on the outer trailing edge of the wings. They control roll.'},
  {q:'And this one, closer to the fuselage?', v:'flap', o:['Aileron','Flap','Trim tab','Spoiler'], a:1, ex:'Flaps are on the inner trailing edge. They give more lift at low speed.'},
  {q:'What is this part of the tail called?', v:'rud', o:['Elevator','Fin','Rudder','Stabilator'], a:2, ex:'The rudder is hinged to the fin. It controls yaw.'},
  {q:'Which instrument is this?', v:'alt', o:['Airspeed indicator','Altimeter','Vertical speed indicator','Tachometer'], a:1, ex:'Three hands and a pressure window (1013 hPa): it shows altitude.'},
  {q:'What does RPM stand for on this gauge?', v:'tach', o:['Rotations per mile','Revolutions per minute','Rate of power and mixture','Radial pressure meter'], a:1, ex:'The tachometer shows engine speed in revolutions per minute.'},
  {q:'What is this tool used for?', v:'torque', o:['Tightening bolts to a precise value','Cutting locking wire','Measuring tyre pressure','Removing rivets'], a:0, ex:'A torque wrench tightens to a set torque, in Nm or in-lb.'},
  {q:'Why is this wire twisted between the two bolts?', v:'wire', o:['To earth the bolts electrically','To stop the bolts from coming loose','To show the bolts are new','To hold a label'], a:1, ex:'Safety wire (lockwire) stops fasteners from loosening with vibration.'},
  {q:'What is this tool called?', v:'feeler', o:['Vernier caliper','Feeler gauge','Micrometer','Tap wrench'], a:1, ex:'Feeler gauge blades measure small gaps, like a spark plug gap.'},
  {q:'What is the pin through this nut called?', v:'cotter', o:['Rivet','Circlip','Cotter pin','Shim'], a:2, ex:'A cotter pin (split pin) goes through a castellated nut to lock it.'},
  {q:'What is the correct order of the four-stroke cycle?', v:'piston', o:['Intake – compression – power – exhaust','Compression – intake – exhaust – power','Intake – power – compression – exhaust','Power – intake – exhaust – compression'], a:0, ex:'"Suck, squeeze, bang, blow."'},
  {q:'Avgas 100LL is dyed which colour?', v:'jar', o:['Red','Green','Blue','Clear'], a:2, ex:'100LL is blue. Jet A-1 is clear or straw-coloured.'},
  {q:'What are these painted marks on the tyre and the wheel for?', v:'creep', o:['To check wheel balance','To show the tyre has not slipped on the rim','To mark the valve position','To show the direction of rotation'], a:1, ex:'Creep marks: if they no longer line up, the tyre has moved on the rim.'}
];

/* ---------- Round 3: aircraft rebus (5 parts + mystery word) ---------- */
const REBUS = [
  {parts:[{p:'pumpkin'},{t:'− KIN'}], ans:['PUMP','FUELPUMP'], word:'PUMP', hint:'It moves fuel from the tank to the engine.'},
  {parts:[{p:'axe'},{t:'− E'},{t:'+ LE'}], ans:['AXLE'], word:'AXLE', hint:'The wheel turns on it.'},
  {parts:[{p:'padlock'},{t:'− PAD'},{t:'+'},{p:'nut'}], ans:['LOCKNUT'], word:'LOCKNUT', hint:'A nut that will not come loose.'},
  {parts:[{p:'burst'},{t:'+'},{p:'eplug'}], ans:['SPARKPLUG','SPARKPLUGS'], word:'SPARK PLUG', hint:'It ignites the mixture in the cylinder.'},
  {parts:[{p:'fire'},{t:'+'},{p:'wall'}], ans:['FIREWALL'], word:'FIREWALL', hint:'It separates the engine from the cabin.'}
];
const MYSTERY = {ans:['FLAPS','FLAP'], word:'FLAPS', hint:'Lower them for landing.'};

/* ---------- Round 4: hangar simulations ---------- */
const SIMS = [
  {title:'Rough engine on run-up',
   brief:'The pilot of F-GKCP stopped the run-up and taxied back to the hangar. Ask questions, find the fault and say what you will do.',
   ask:['What did you notice?','Which magneto was it?','How big was the RPM drop?','Was it rough on both magnetos?','When did it start?'],
   say:'"The engine was rough during the run-up, so I came back."',
   ifAsked:['It was rough only on the LEFT magneto.','The RPM drop on the left was about 300 rpm (the limit is 175).','The right magneto was normal.','The last flight was short, with a long time at idle.'],
   fault:'A fouled (dirty) spark plug fired by the left magneto.',
   fix:'Remove and clean or replace the plugs, check the gaps, then do a ground run and a magneto check.',
   opts:['Fouled spark plug','Carburettor icing','Flat tyre','Blocked pitot tube'], a:0},
  {title:'Discharge and a warning light',
   brief:'A pilot comes back from a local flight and reports an electrical problem. Ask questions, find the fault and say what you will do.',
   ask:['What did the ammeter show?','Did a warning light come on?','Did you hear any noise?','Is the battery new?'],
   say:'"I think there’s an electrical problem. The radio was crackling."',
   ifAsked:['The ammeter showed a discharge (needle on minus).','The low-voltage light flickered, then stayed on.','There was a squealing noise when the engine started.','The battery was replaced last month.'],
   fault:'A worn, slipping alternator belt, so the alternator does not charge.',
   fix:'Replace the belt, set the tension, check the alternator output on a ground run.',
   opts:['Dead battery','Worn, slipping alternator belt','Magneto timing','Vacuum pump failure'], a:1},
  {title:'Pulling to one side',
   brief:'After landing, a student pilot says the aircraft was hard to keep straight. Ask questions, find the fault and say what you will do.',
   ask:['Which way does it pull?','How do the pedals feel?','Did you see any fluid?','Is it the same without braking?'],
   say:'"When I brake, the aircraft pulls to one side."',
   ifAsked:['It pulls to the LEFT when braking.','The right brake pedal feels soft and spongy. It goes almost to the floor.','There is a red fluid stain near the right wheel.','Without braking, it taxis straight.'],
   fault:'A hydraulic leak in the right brake: the right brake is weak, so the left brake pulls.',
   fix:'Find and repair the leak (seal or line), refill and bleed the brakes, then test.',
   opts:['Low tyre pressure on the left','Leaking right brake line','Worn nose-wheel shimmy damper','Wrong rudder rigging'], a:1},
  {title:'No airspeed on take-off',
   brief:'A pilot aborted the take-off and taxied back. Ask questions, find the fault and say what you will do.',
   ask:['Which instrument failed?','Did the altimeter work?','Where was the aircraft parked?','Was the cover on?'],
   say:'"I had to abort the take-off. The airspeed indicator stayed at zero."',
   ifAsked:['The altimeter and the vertical speed indicator worked normally.','The aircraft was parked outside for two weeks.','The pitot cover was not on.','There were a lot of wasps around the aircraft.'],
   fault:'A blocked pitot tube (a wasp nest inside).',
   fix:'Clean the pitot tube, leak-test the pitot-static system, remind pilots to use the cover.',
   opts:['Blocked static port','Blocked pitot tube','Alternator failure','Vacuum pump failure'], a:1},
  {title:'Oil on the windscreen',
   brief:'A pilot lands early and comes to the hangar, worried. Ask questions, find the fault and say what you will do.',
   ask:['What did the oil pressure gauge show?','When was the oil last checked?','Where exactly is the oil?'],
   say:'"There’s oil all over the windscreen!"',
   ifAsked:['The oil pressure went up and down; the oil temperature was high.','The oil was checked and topped up just before the flight.','The oil is on top of the cowling and on the windscreen.','The dipstick was hard to put back.'],
   fault:'The oil filler cap (dipstick) was not secured after the oil check.',
   fix:'Check the oil level, secure the cap, clean the engine, inspect for damage, ground run to check for leaks.',
   opts:['Oil filler cap not secured','Fouled spark plug','Carburettor icing','Water in the fuel'], a:0},
  {title:'Slow start on a cold morning',
   brief:'A pilot calls you to the flight line: the aircraft won’t start. Ask questions, find the fault and say what you will do.',
   ask:['What happens when you turn the key?','Was the master switch off yesterday?','What does the ammeter show?','How cold was it?'],
   say:'"The engine won’t start. The propeller turns very slowly, then it just clicks."',
   ifAsked:['The master switch was left ON after yesterday’s last flight.','It was −2 °C last night.','The ammeter shows nothing.','Yesterday it started normally.'],
   fault:'A flat battery (master switch left on overnight).',
   fix:'Charge or replace the battery, clean the terminals, check the alternator charges after start.',
   opts:['Flat battery','Fouled spark plug','Blocked fuel strainer','Broken propeller'], a:0}
];

/* ---------- Round 5: dialogue challenge ---------- */
const TOPICS = [
  {title:'Shift handover', roles:['Outgoing mechanic: explain what you did today on F-GKCP’s 100-hour inspection and what is still to do.','Incoming mechanic: ask questions and check that everything is clear.'], phrases:['I’ve already…','I haven’t … yet.','Could you check…?','What about the…?','Make sure you…']},
  {title:'Grounded!', roles:['Pilot: you want to fly in 30 minutes. Insist!','Mechanic: explain why the aircraft cannot fly today.'], phrases:['I’m afraid…','It isn’t safe because…','When will it be ready?','We need to wait for…','I understand, but…']},
  {title:'Ordering parts by phone', roles:['Mechanic: you need a new main-wheel tyre and brake linings for a DR400.','Supplier: ask for part numbers, quantity, delivery address and date.'], phrases:['I’d like to order…','What’s the part number?','How long will delivery take?','Can you send it by…?','Could you spell that, please?']},
  {title:'Training an apprentice', roles:['Senior mechanic: explain how to do a pre-flight walk-around.','Apprentice: ask "why?" about every step.'], phrases:['First,…','Then…','Why do we…?','You have to check…','Don’t forget to…']},
  {title:'Is this dent OK?', roles:['Mechanic 1: you think the dent on the flap is within limits.','Mechanic 2: you think the flap must be repaired before the next flight.'], phrases:['In my opinion…','According to the manual…','I don’t agree because…','What if…?','Let’s check…']},
  {title:'The inspection will be late', roles:['Mechanic: explain to the flight school manager why the inspection will take two more days.','Manager: you have students booked tomorrow. Ask for solutions.'], phrases:['Unfortunately…','We found…','The part won’t arrive until…','Could we … instead?','What’s the best solution?']}
];

/* ---------- Rounds ---------- */
const ROUNDS = [null,
  {n:1, title:'Part & Scenario Relay', short:'Explain a repair, the other team finds the part.', items:CARDS, time:60, unit:'Card', shuffle:true,
   rules:['One team explains, the other team finds the part. Teams take turns; the explainer changes every card.','Explainer: read your scenario card silently, then explain the repair in English. Don’t say the words on your card!','Other team: choose the part on your device. You have 3 tries and 60 seconds.'],
   points:['Part found: +1 for the finding team','Part found: +1 for the explaining team (clear explanation)']},
  {n:2, title:'Technical Trivia', short:'Picture questions, both teams answer at the same time.', items:TRIVIA, time:30, unit:'Question', shuffle:true,
   rules:['Both teams see the same question and picture.','Discuss in your team (in English!) and choose one answer on your device.','30 seconds per question. Your answer is final.'],
   points:['Correct answer: +1','Both teams correct: +1 bonus for the faster team']},
  {n:3, title:'Aircraft Rebus', short:'Five picture puzzles hide five aircraft words, then a mystery word.', items:[...REBUS, MYSTERY], time:90, unit:'Rebus', shuffle:false,
   rules:['Each rebus gives an aircraft word. Type it on your device.','The first letter of each answer goes into the mystery word.','After the 5 rebuses, unscramble the 5 letters to find the mystery word.','A hint appears at half time.'],
   points:['Rebus: first team +2, second team +1','Mystery word: first team +3, second team +1']},
  {n:4, title:'Hangar Simulations', short:'Role-play: mechanics question a pilot and find the fault.', items:SIMS, time:240, unit:'Scenario', shuffle:true,
   rules:['One team plays the mechanics, the other team plays the pilot. Teams swap every scenario.','Pilot team: read your role card. Give the hidden facts only when the mechanics ask the right question.','Mechanics: ask questions, then choose your diagnosis on your device and explain the fix. 4 minutes.'],
   points:['Correct diagnosis: +2 for the mechanics','Clear questions and explanation in English: +1 (decided by the pilot team)']},
  {n:5, title:'Dialogue Challenge', short:'Two minutes of non-stop dialogue. Hesitate and the other team buzzes in!', items:TOPICS, time:120, unit:'Dialogue', shuffle:true,
   rules:['Two players from the speaking team act out the dialogue for 2 minutes, without stopping.','If they hesitate (long pause, “euh…”, a French word), the other team can BUZZ.','The trainer accepts or rejects the buzz. If accepted, two players from the buzzing team take over the dialogue.'],
   points:['Accepted buzz: +1 for the buzzing team','Team still speaking at the end: +2']}
];
