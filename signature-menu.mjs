/**
 * Signature restaurant & bar — proposed menu for design review.
 * USD amounts are illustrative, NOT a confirmed price list or stock list.
 * Prices are integer cents; drink serving sizes are explicit.
 */
export const menuSections = [
  {id:'all',name:'Full menu',note:'From the kitchen and the bar'},
  {id:'food',name:'Food',note:'Local favourites, grill & good company'},
  {id:'drinks',name:'Drinks & Bar',note:'Lagers, spirits, cocktails & beverages'}
];
export const menuCategories = [
  {name:'Zimbabwean favourites',section:'food',art:'local'},
  {name:'Grill & chicken',section:'food',art:'chicken'},
  {name:'Burgers & wraps',section:'food',art:'burger'},
  {name:'Sides & small plates',section:'food',art:'side'},
  {name:'Desserts',section:'food',art:'dessert'},
  {name:'Lagers & ciders',section:'drinks',art:'beer'},
  {name:'Whiskies',section:'drinks',art:'whisky'},
  {name:'Vodka',section:'drinks',art:'vodka'},
  {name:'Gin',section:'drinks',art:'gin'},
  {name:'Rum & tequila',section:'drinks',art:'rum'},
  {name:'Brandy & cognac',section:'drinks',art:'brandy'},
  {name:'Cocktails',section:'drinks',art:'cocktail'},
  {name:'Wine & bubbles',section:'drinks',art:'wine'},
  {name:'Soft drinks & juices',section:'drinks',art:'juice'},
  {name:'Coffee & tea',section:'drinks',art:'coffee',image:'coffee.webp'},
  {name:'Milkshakes & coolers',section:'drinks',art:'shake',image:'shake.webp'}
];
const categories = Object.fromEntries(menuCategories.map(c=>[c.name,c]));
const localSides=[{label:'Sadza',extra:0},{label:'Rice',extra:50},{label:'Chips',extra:100}];
const products=[];
function food(category,rows,defaults={}) {
  for(const [id,name,price,description,extra={}] of rows) products.push({id,name,price,description,category,section:'food',art:categories[category].art,unit:'per portion',station:'kitchen',...defaults,...extra});
}
function drinks(category,rows,defaults={}) {
  for(const [id,name,price,description,extra={}] of rows) products.push({id,name,price,description,category,section:'drinks',art:categories[category].art,unit:'per serving',station:'bar',...defaults,...extra});
}
function spirits(category,rows) {
  drinks(category,rows.map(([id,name,tot,bottle,description])=>[id,name,tot,description,{servings:[{label:'Single tot · 30 ml',price:tot},{label:'Double · 60 ml',price:tot*2},{label:'Bottle · 750 ml',price:bottle}]}]),{alcohol:true,unit:'30 ml tot'});
}
food('Zimbabwean favourites',[
 ['mazondo','Sadza & mazondo',900,'Slow-cooked beef trotters in a rich tomato gravy, with sadza and covo.',{tag:'TASTE OF HOME'}],
 ['beef-stew','Sadza & beef stew',800,'Tender beef in homestyle gravy, served with sadza and seasonal greens.'],
 ['road-runner','Road runner chicken & sadza',1100,'Slow-cooked road runner chicken, hearty gravy and leafy greens.'],
 ['maguru','Maguru & sadza',800,'Slow-simmered tripe in a tomato and onion relish, with sadza and greens.'],
 ['madora','Madora & sadza',900,'Mopane worms cooked with tomato and onion, with sadza and covo.'],
 ['kapenta','Kapenta & sadza',650,'Crisp kapenta with tomato relish, sadza and leafy greens.'],
 ['sadza-beans','Sadza, covo & beans',550,'A generous home-style plate of sadza, sugar beans and seasonal greens.',{tag:'MEAT-FREE'}],
 ['peanut-greens','Rice & peanut-butter greens',550,'Rice with creamy peanut-butter greens and a side of beans.',{sides:[{label:'Rice',extra:0},{label:'Sadza',extra:0}],tag:'MEAT-FREE'}]
],{sides:localSides});
food('Grill & chicken',[
 ['chicken','Signature quarter chicken',850,'Flame-grilled quarter chicken, finished with house peri-peri.',{art:'chicken',tag:'HOUSE FAVOURITE',meal:true}],
 ['full','Whole fire-roasted chicken',2400,'A whole flame-roasted chicken for the table. Choose your heat.',{art:'roast',tag:'FOR THE TABLE',meal:true}],
 ['tbone','Flame-grilled T-bone',1400,'A generous grilled T-bone with house relish. Add your favourite side.',{meal:true}],
 ['pork-chops','Chargrilled pork chops',1000,'Juicy pork chops, chargrilled and served with a house glaze.',{meal:true}],
 ['boerewors','Boerewors from the grill',750,'Grilled boerewors with tomato and onion relish.',{meal:true}],
 ['tilapia','Whole grilled tilapia',1200,'Whole grilled fish finished with lemon and herbs.',{art:'fish',meal:true}]
]);
food('Burgers & wraps',[
 ['burger','Signature cheeseburger',700,'Beef, melted cheese, crisp lettuce and Signature sauce.',{tag:'CROWD FAVOURITE'}],
 ['chicken-burger','Peri-peri chicken burger',650,'Grilled chicken, lettuce and peri-peri mayonnaise in a toasted bun.'],
 ['wrap','Peri-peri chicken wrap',650,'Tender chicken, crunchy slaw and peri-peri in a toasted wrap.',{art:'wrap'}]
],{meal:true});
food('Sides & small plates',[
 ['fries','Loaded golden fries',450,'Crisp fries with cheese, house sauce and savoury toppings.',{}],
 ['chips','Golden chips',250,'A portion of crisp, golden chips with house seasoning.'],
 ['sadza','Sadza',150,'A freshly cooked side portion of traditional maize-meal sadza.',{art:'sadza'}],
 ['rice','Steamed rice',150,'A side portion of steamed white rice.',{art:'rice'}],
 ['covo','Covo greens',150,'Seasonal leafy greens cooked with onion and tomato.',{art:'greens'}],
 ['coleslaw','Fresh coleslaw',200,'Shredded cabbage and carrot in a creamy dressing.',{art:'greens'}],
 ['wings','Sticky fire wings',650,'Six chicken wings tossed in a sweet chilli glaze.',{art:'wings',meal:true,tag:'WITH YOUR NEXT ROUND'}]
]);
food('Desserts',[
 ['brownie','Warm chocolate brownie',450,'A warm chocolate brownie with a scoop of vanilla ice cream.'],
 ['icecream','Vanilla ice cream',300,'Two scoops of vanilla ice cream with your choice of chocolate or caramel sauce.',{art:'icecream'}]
]);
drinks('Lagers & ciders',[
 ['zambezi','Zambezi Lager',300,'A chilled bottle to enjoy with your favourite local meal.',{tag:'LOCAL FAVOURITE'}],
 ['castle','Castle Lager',300,'Served chilled from the bar.'],
 ['black-label','Carling Black Label',350,'Served chilled from the bar.'],
 ['heineken','Heineken',400,'Served chilled from the bar.'],
 ['savanna','Savanna Dry cider',400,'A crisp cider, served chilled.',{art:'cider'}],
 ['hunters','Hunters Gold cider',350,'A chilled cider for an easy afternoon.',{art:'cider'}]
],{alcohol:true,unit:'330 ml bottle'});
spirits('Whiskies',[
 ['jw-red','Johnnie Walker Red Label',350,3500,'Your choice of a measured pour or a bottle for the table.'],
 ['jw-black','Johnnie Walker Black Label',500,5500,'Your choice of a measured pour or a bottle for the table.'],
 ['jameson','Jameson',450,4500,'Irish whiskey, served your way.'],
 ['jack-daniels','Jack Daniels',450,5000,'Whiskey, served your way.'],
 ['glenfiddich','Glenfiddich 12',650,7500,'Single malt whisky, served your way.']
]);
spirits('Vodka',[
 ['smirnoff','Smirnoff Red',250,2200,'Vodka, served neat or over ice. Mixers ordered separately.'],
 ['absolut','Absolut',350,3500,'Vodka, served neat or over ice. Mixers ordered separately.'],
 ['skyy','SKYY',350,3200,'Vodka, served neat or over ice. Mixers ordered separately.']
]);
spirits('Gin',[
 ['gordons','Gordons London Dry',300,2800,'Gin, served neat or over ice. Pair with tonic from the drinks menu.'],
 ['bombay','Bombay Sapphire',450,4500,'Gin, served neat or over ice. Mixers ordered separately.'],
 ['tanqueray','Tanqueray',450,4500,'Gin, served neat or over ice. Mixers ordered separately.']
]);
spirits('Rum & tequila',[
 ['bacardi','Bacardi white rum',300,3000,'White rum, served your way. Mixers ordered separately.'],
 ['captain-morgan','Captain Morgan spiced rum',350,3500,'Spiced rum, served your way. Mixers ordered separately.'],
 ['cuervo','Jose Cuervo tequila',350,3500,'Tequila, with lime available on request.']
]);
spirits('Brandy & cognac',[
 ['kwv','KWV brandy',300,3000,'Brandy, served neat or over ice.'],
 ['hennessy','Hennessy VS',650,7500,'Cognac, served neat or over ice.']
]);
drinks('Cocktails',[
 ['signature-sunset','Signature Sunset',700,'Vodka, orange, pineapple and a splash of grenadine.',{tag:'SIGNATURE POUR'}],
 ['mojito','Classic mojito',650,'White rum, mint, lime and soda.',{art:'mojito'}],
 ['margarita','Margarita',700,'Tequila, orange liqueur and lime, with a salted rim.'],
 ['pina-colada','Pina colada',700,'White rum, pineapple and creamy coconut.',{art:'tropical'}],
 ['long-island','Long Island iced tea',850,'A mixed-spirit cocktail with citrus and a splash of cola.',{art:'highball'}],
 ['whisky-sour','Whisky sour',700,'Whisky, lemon and a touch of sweetness.',{art:'highball'}]
],{alcohol:true,unit:'1 cocktail'});
drinks('Wine & bubbles',[
 ['house-red','House red wine',500,'A glass for your meal or a bottle for the table.',{servings:[{label:'Glass · 150 ml',price:500},{label:'Bottle · 750 ml',price:2200}]}],
 ['house-white','House white wine',500,'Served chilled by the glass or bottle.',{art:'white-wine',servings:[{label:'Glass · 150 ml',price:500},{label:'Bottle · 750 ml',price:2200}]}],
 ['rose','House rose',550,'A chilled rose for a relaxed afternoon.',{servings:[{label:'Glass · 150 ml',price:550},{label:'Bottle · 750 ml',price:2400}]}],
 ['bubbles','Sparkling wine',3000,'A chilled bottle for a celebration.',{art:'white-wine',unit:'750 ml bottle'}]
],{alcohol:true,unit:'150 ml glass'});
drinks('Soft drinks & juices',[
 ['cola','Coca-Cola',200,'A chilled soft drink.',{unit:'330 ml can',art:'cola'}],
 ['sprite','Sprite',200,'A chilled lemon-lime soft drink.',{unit:'330 ml can'}],
 ['fanta','Fanta Orange',200,'A chilled orange soft drink.',{unit:'330 ml can'}],
 ['tonic','Tonic water',200,'A chilled mixer to pair with your favourite spirit.',{unit:'200 ml bottle'}],
 ['soda','Soda water',150,'A chilled sparkling mixer.',{unit:'200 ml bottle'}],
 ['water','Still mineral water',150,'Bottled still water.',{unit:'500 ml bottle',art:'water'}],
 ['orange-juice','Orange juice',300,'Served chilled over ice.',{unit:'300 ml glass'}],
 ['pineapple-juice','Pineapple juice',300,'Served chilled over ice.',{unit:'300 ml glass'}],
 ['virgin-mojito','Virgin mojito',400,'Mint, lime and soda. A fresh alcohol-free cocktail.',{unit:'1 mocktail',art:'mojito',tag:'ALCOHOL-FREE'}]
]);
drinks('Coffee & tea',[
 ['coffee','Barista cappuccino',300,'Espresso with silky milk and a generous cap of foam.',{image:'coffee.webp'}],
 ['espresso','Espresso',200,'A small, strong coffee to start or finish your visit.'],
 ['latte','Cafe latte',350,'Espresso with steamed milk.'],
 ['tea','Tea',200,'Choose black tea, rooibos or a milky cup.',{art:'tea'}],
 ['hot-chocolate','Hot chocolate',350,'A rich chocolate drink with warm milk.']
],{unit:'1 cup'});
drinks('Milkshakes & coolers',[
 ['shake','Vanilla cloud milkshake',400,'Smooth vanilla, whipped up thick and served cold.',{image:'shake.webp',tag:'SOMETHING SWEET'}],
 ['mango','Mango cooler',350,'A bright mango ice blend.',{art:'juice'}],
 ['berry-cooler','Berry & watermelon cooler',350,'An icy blend of summer fruit.',{art:'cocktail'}]
],{unit:'350 ml glass'});
export const signatureMenu = products;