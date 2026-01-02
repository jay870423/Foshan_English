import { Word, Grade, Semester } from './types';

// Helper to expand compact data
// Input Format: "Grade-Semester-Unit|Word|Translation|IPA|Sentence"
// Example: "1-1-1|ruler|..."
const parse = (data: string[]): Word[] => {
  return data.map((line) => {
    const parts = line.split('|');
    // Safety check: must have at least 5 parts
    if (parts.length < 5) return null;

    const [location, text, trans, ipa, sent] = parts;
    const [gStr, sStr, uStr] = location.split('-');

    return {
      id: `${location}-${text.replace(/\s+/g, '-')}`,
      grade: parseInt(gStr) as Grade,
      semester: sStr as Semester,
      unit: parseInt(uStr),
      text: text.trim(),
      translation: trans.trim(),
      ipa: ipa ? ipa.trim() : '',
      sentence: sent ? sent.trim() : `This is a ${text}.`,
    };
  }).filter(Boolean) as Word[];
};

const RAW_VOCAB = [
  // ================= GRADE 1 (One) =================
  // G1 S1 U1: School
  "1-1-1|ruler|尺子|/ˈruːlə/|I have a ruler.", "1-1-1|pencil|铅笔|/ˈpensl/|A pencil.", "1-1-1|eraser|橡皮|/ɪˈreɪzə/|An eraser.", 
  "1-1-1|crayon|蜡笔|/ˈkreɪən/|Red crayon.", "1-1-1|bag|包|/bæɡ/|My bag.", "1-1-1|book|书|/bʊk/|Open your book.", 
  "1-1-1|pencil box|铅笔盒|/bɒks/|My pencil box.", "1-1-1|sharpener|卷笔刀|/ˈʃɑːpənə/|A sharpener.", "1-1-1|school|学校|/skuːl/|My school.",
  
  // G1 S1 U2: Body
  "1-1-2|face|脸|/feɪs/|Touch your face.", "1-1-2|ear|耳朵|/ɪə/|Touch your ear.", "1-1-2|eye|眼睛|/aɪ/|Close your eye.", 
  "1-1-2|nose|鼻子|/nəʊz/|Touch your nose.", "1-1-2|mouth|嘴|/maʊθ/|Open your mouth.", "1-1-2|arm|胳膊|/ɑːm/|Wave your arm.", 
  "1-1-2|hand|手|/hænd/|Clap your hands.", "1-1-2|head|头|/hed/|Touch your head.", "1-1-2|body|身体|/ˈbɒdi/|Shake your body.", 
  "1-1-2|leg|腿|/leɡ/|Lift your leg.", "1-1-2|foot|脚|/fʊt/|Stamp your foot.",

  // G1 S1 U3: Colors
  "1-1-3|red|红色|/red/|It is red.", "1-1-3|green|绿色|/ɡriːn/|It is green.", "1-1-3|yellow|黄色|/ˈjeləʊ/|It is yellow.", 
  "1-1-3|blue|蓝色|/bluː/|It is blue.", "1-1-3|black|黑色|/blæk/|It is black.", "1-1-3|white|白色|/waɪt/|It is white.", 
  "1-1-3|orange|橙色|/ˈɒrɪndʒ/|Orange colour.", "1-1-3|pink|粉色|/pɪŋk/|Pink flower.", "1-1-3|brown|棕色|/braʊn/|Brown bear.",
  "1-1-3|purple|紫色|/ˈpɜːpl/|Purple grape.",

  // G1 S1 U4: Animals
  "1-1-4|cat|猫|/kæt/|It is a cat.", "1-1-4|dog|狗|/dɒɡ/|It is a dog.", "1-1-4|bird|鸟|/bɜːd/|It is a bird.", 
  "1-1-4|panda|熊猫|/ˈpændə/|A cute panda.", "1-1-4|tiger|老虎|/ˈtaɪɡə/|A big tiger.", "1-1-4|elephant|大象|/ˈelɪfənt/|A big elephant.", 
  "1-1-4|monkey|猴子|/ˈmʌŋki/|A funny monkey.", "1-1-4|bear|熊|/beə/|A brown bear.", "1-1-4|pig|猪|/pɪɡ/|A pink pig.", 
  "1-1-4|duck|鸭子|/dʌk/|A yellow duck.", "1-1-4|zoo|动物园|/zuː/|Go to the zoo.",

  // G1 S1 U5: Food
  "1-1-5|bread|面包|/bred/|I like bread.", "1-1-5|juice|果汁|/dʒuːs/|Drink juice.", "1-1-5|egg|蛋|/eɡ/|Eat an egg.", 
  "1-1-5|milk|牛奶|/mɪlk/|Drink milk.", "1-1-5|water|水|/ˈwɔːtə/|Drink water.", "1-1-5|cake|蛋糕|/keɪk/|Happy birthday.", 
  "1-1-5|rice|米饭|/raɪs/|Eat rice.", "1-1-5|fish|鱼|/fɪʃ/|Eat fish.", "1-1-5|candy|糖果|/ˈkændi/|Sweet candy.",

  // G1 S1 U6: Numbers
  "1-1-6|one|一|/wʌn/|1.", "1-1-6|two|二|/tuː/|2.", "1-1-6|three|三|/θriː/|3.", "1-1-6|four|四|/fɔː/|4.", 
  "1-1-6|five|五|/faɪv/|5.", "1-1-6|six|六|/sɪks/|6.", "1-1-6|seven|七|/ˈsevn/|7.", "1-1-6|eight|八|/eɪt/|8.", 
  "1-1-6|nine|九|/naɪn/|9.", "1-1-6|ten|十|/ten/|10.",

  // G1 S2 U1: Class
  "1-2-1|teacher|老师|/ˈtiːtʃə/|Hello teacher.", "1-2-1|student|学生|/ˈstjuːdnt/|I am a student.", "1-2-1|pupil|小学生|/ˈpjuːpl/|I am a pupil.",
  "1-2-1|he|他|/hiː/|He is Tom.", "1-2-1|she|她|/ʃiː/|She is Amy.", "1-2-1|boy|男孩|/bɔɪ/|A boy.", "1-2-1|girl|女孩|/ɡɜːl/|A girl.",
  "1-2-1|friend|朋友|/frend/|My friend.",

  // G1 S2 U2: Family
  "1-2-2|father|父亲|/ˈfɑːðə/|My father.", "1-2-2|dad|爸爸|/dæd/|My dad.", "1-2-2|mother|母亲|/ˈmʌðə/|My mother.", 
  "1-2-2|mum|妈妈|/mʌm/|My mum.", "1-2-2|brother|兄弟|/ˈbrʌðə/|My brother.", "1-2-2|sister|姐妹|/ˈsɪstə/|My sister.", 
  "1-2-2|grandma|奶奶|/ˈɡrænmɑː/|My grandma.", "1-2-2|grandpa|爷爷|/ˈɡrænpɑː/|My grandpa.", "1-2-2|man|男人|/mæn/|The man.", "1-2-2|woman|女人|/ˈwʊmən/|The woman.",

  // G1 S2 U3: Adjectives
  "1-2-3|small|小的|/smɔːl/|It is small.", "1-2-3|big|大的|/bɪɡ/|It is big.", "1-2-3|long|长的|/lɒŋ/|Long tail.", 
  "1-2-3|short|短的|/ʃɔːt/|Short tail.", "1-2-3|tall|高的|/tɔːl/|He is tall.", "1-2-3|fat|胖的|/fæt/|Fat bear.", 
  "1-2-3|thin|瘦的|/θɪn/|Thin monkey.", "1-2-3|tail|尾巴|/teɪl/|A long tail.", "1-2-3|giraffe|长颈鹿|/dʒəˈrɑːf/|Look at the giraffe.",

  // G1 S2 U4: Fruits
  "1-2-4|apple|苹果|/ˈæpl/|Red apple.", "1-2-4|pear|梨|/peə/|Yellow pear.", "1-2-4|orange|橙子|/ˈɒrɪndʒ/|Big orange.", 
  "1-2-4|banana|香蕉|/bəˈnɑːnə/|Yellow banana.", "1-2-4|grape|葡萄|/ɡreɪp/|Purple grape.", "1-2-4|strawberry|草莓|/ˈstrɔːbəri/|Red strawberry.", 
  "1-2-4|watermelon|西瓜|/ˈwɔːtəmelən/|Big watermelon.", "1-2-4|fruit|水果|/fruːt/|I like fruit.",

  // G1 S2 U5: Position/Toys
  "1-2-5|boat|小船|/bəʊt/|A boat.", "1-2-5|car|车|/kɑː/|Blue car.", "1-2-5|map|地图|/mæp/|A map.", "1-2-5|cap|帽子|/kæp/|A cap.", 
  "1-2-5|ball|球|/bɔːl/|Play ball.", "1-2-5|desk|桌子|/desk/|On the desk.", "1-2-5|chair|椅子|/tʃeə/|Under the chair.", 
  "1-2-5|in|在..里|/ɪn/|In the box.", "1-2-5|on|在..上|/ɒn/|On the desk.", "1-2-5|under|在..下|/ˈʌndə/|Under the chair.",

  // G1 S2 U6: Numbers (11-20)
  "1-2-6|eleven|十一|/ɪˈlevn/|11.", "1-2-6|twelve|十二|/twelv/|12.", "1-2-6|thirteen|十三|/ˌθɜːˈtiːn/|13.", "1-2-6|fourteen|十四|/ˌfɔːˈtiːn/|14.", 
  "1-2-6|fifteen|十五|/ˌfɪfˈtiːn/|15.", "1-2-6|sixteen|十六|/ˌsɪksˈtiːn/|16.", "1-2-6|seventeen|十七|/ˌsevnˈtiːn/|17.", "1-2-6|eighteen|十八|/ˌeɪˈtiːn/|18.", 
  "1-2-6|nineteen|十九|/ˌnaɪnˈtiːn/|19.", "1-2-6|twenty|二十|/ˈtwenti/|20.", "1-2-6|kite|风筝|/kaɪt/|A kite.",


  // ================= GRADE 2 (Two) =================
  // G2 S1 U1: Family & Relations
  "2-1-1|grandfather|爷爷|/ˈɡrænfɑːðə/|My grandpa.", "2-1-1|grandmother|奶奶|/ˈɡrænmʌðə/|My grandma.", "2-1-1|family|家庭|/ˈfæməli/|My family.",
  "2-1-1|parents|父母|/ˈpeərənts/|My parents.", "2-1-1|uncle|叔叔|/ˈʌŋkl/|My uncle.", "2-1-1|aunt|阿姨|/ɑːnt/|My aunt.",
  "2-1-1|cousin|堂表亲|/ˈkʌzn/|My cousin.", "2-1-1|baby|婴儿|/ˈbeɪbi/|Little baby.",

  // G2 S1 U2: Friends
  "2-1-2|man|男人|/mæn/|Who is that man?", "2-1-2|woman|女人|/ˈwʊmən/|Who is that woman?", "2-1-2|boy|男孩|/bɔɪ/|A boy.", 
  "2-1-2|girl|女孩|/ɡɜːl/|A girl.", "2-1-2|friend|朋友|/frend/|Good friend.", "2-1-2|hair|头发|/heə/|Long hair.",
  "2-1-2|shoe|鞋|/ʃuː/|Blue shoes.", "2-1-2|glasses|眼镜|/ˈɡlɑːsɪz/|Wear glasses.",

  // G2 S1 U3: Rooms
  "2-1-3|home|家|/həʊm/|Go home.", "2-1-3|room|房间|/ruːm/|My room.", "2-1-3|bedroom|卧室|/ˈbedruːm/|Sleep in bedroom.", 
  "2-1-3|living room|客厅|/ˈlɪvɪŋ/|Watch TV.", "2-1-3|study|书房|/ˈstʌdi/|Read in study.", "2-1-3|kitchen|厨房|/ˈkɪtʃɪn/|Cook in kitchen.", 
  "2-1-3|bathroom|浴室|/ˈbɑːθruːm/|Wash in bathroom.", "2-1-3|phone|电话|/fəʊn/|Answer the phone.", "2-1-3|table|桌子|/ˈteɪbl/|On the table.", 
  "2-1-3|sofa|沙发|/ˈsəʊfə/|Sit on sofa.", "2-1-3|fridge|冰箱|/frɪdʒ/|Open the fridge.",

  // G2 S1 U4: Furniture/Home
  "2-1-4|door|门|/dɔː/|Open the door.", "2-1-4|window|窗户|/ˈwɪndəʊ/|Close the window.", "2-1-4|bed|床|/bed/|Make the bed.", 
  "2-1-4|computer|电脑|/kəmˈpjuːtə/|Use computer.", "2-1-4|desk|书桌|/desk/|Clean the desk.", "2-1-4|chair|椅子|/tʃeə/|Sit on chair.", 
  "2-1-4|key|钥匙|/kiː/|Where is the key?", "2-1-4|lock|锁|/lɒk/|Open the lock.", "2-1-4|floor|地板|/flɔː/|Sweep the floor.",

  // G2 S1 U5: Dinner
  "2-1-5|beef|牛肉|/biːf/|I like beef.", "2-1-5|chicken|鸡肉|/ˈtʃɪkɪn/|I like chicken.", "2-1-5|noodles|面条|/ˈnuːdlz/|Eat noodles.", 
  "2-1-5|soup|汤|/suːp/|Drink soup.", "2-1-5|vegetable|蔬菜|/ˈvedʒtəbl/|Fresh vegetable.", "2-1-5|chopsticks|筷子|/ˈtʃɒpstɪks/|Use chopsticks.", 
  "2-1-5|bowl|碗|/bəʊl/|A bowl of rice.", "2-1-5|spoon|勺子|/spuːn/|Use a spoon.", "2-1-5|knife|刀|/naɪf/|Knife and fork.", 
  "2-1-5|fork|叉|/fɔːk/|Use a fork.", "2-1-5|dinner|晚餐|/ˈdɪnə/|Ready for dinner.",

  // G2 S1 U6: Jobs
  "2-1-6|doctor|医生|/ˈdɒktə/|See a doctor.", "2-1-6|nurse|护士|/nɜːs/|A kind nurse.", "2-1-6|driver|司机|/ˈdraɪvə/|Bus driver.", 
  "2-1-6|farmer|农民|/ˈfɑːmə/|Hard farmer.", "2-1-6|cook|厨师|/kʊk/|Good cook.", "2-1-6|player|运动员|/ˈpleɪə/|Football player.", 
  "2-1-6|teacher|老师|/ˈtiːtʃə/|English teacher.", "2-1-6|worker|工人|/ˈwɜːkə/|Factory worker.", "2-1-6|police|警察|/pəˈliːs/|Police officer.",

  // G2 S2 U1: Weather
  "2-2-1|cold|冷|/kəʊld/|It is cold.", "2-2-1|hot|热|/hɒt/|It is hot.", "2-2-1|cool|凉爽|/kuːl/|It is cool.", 
  "2-2-1|warm|暖和|/wɔːm/|It is warm.", "2-2-1|sunny|晴朗|/ˈsʌni/|Sunny day.", "2-2-1|rainy|下雨|/ˈreɪni/|Rainy day.", 
  "2-2-1|windy|有风|/ˈwɪndi/|Windy day.", "2-2-1|cloudy|多云|/ˈklaʊdi/|Cloudy day.", "2-2-1|snowy|下雪|/ˈsnəʊi/|Snowy day.", 
  "2-2-1|weather|天气|/ˈweðə/|Good weather.",

  // G2 S2 U2: Time
  "2-2-2|breakfast|早餐|/ˈbrekfəst/|Eat breakfast.", "2-2-2|lunch|午餐|/lʌntʃ/|Eat lunch.", "2-2-2|dinner|晚餐|/ˈdɪnə/|Eat dinner.", 
  "2-2-2|music class|音乐课|/ˈmjuːzɪk/|Music class.", "2-2-2|PE class|体育课|/piː iː/|PE class.", "2-2-2|get up|起床|/ɡet ʌp/|Get up early.", 
  "2-2-2|go to school|上学|/skuːl/|Go to school.", "2-2-2|go home|回家|/həʊm/|Go home now.", "2-2-2|go to bed|睡觉|/bed/|Go to bed.", 
  "2-2-2|clock|钟|/klɒk/|It is a clock.", "2-2-2|time|时间|/taɪm/|What time?",

  // G2 S2 U3: Weather (Clothes context overlap in some books, keeping PEP theme)
  "2-2-3|tomato|西红柿|/təˈmɑːtəʊ/|Red tomato.", "2-2-3|potato|土豆|/pəˈteɪtəʊ/|Brown potato.", "2-2-3|green beans|豆角|/biːnz/|Green beans.", 
  "2-2-3|carrot|胡萝卜|/ˈkærət/|Orange carrot.", "2-2-3|onion|洋葱|/ˈʌnjən/|Onion.", "2-2-3|cucumber|黄瓜|/ˈkjuːkʌmbə/|Cucumber.",
  "2-2-3|vegetable|蔬菜|/ˈvedʒtəbl/|Fresh vegetable.", "2-2-3|garden|花园|/ˈɡɑːdn/|In the garden.",

  // G2 S2 U4: Farm Animals
  "2-2-4|horse|马|/hɔːs/|Ride a horse.", "2-2-4|cow|母牛|/kaʊ/|Milk a cow.", "2-2-4|sheep|绵羊|/ʃiːp/|White sheep.", 
  "2-2-4|hen|母鸡|/hen/|Fat hen.", "2-2-4|goat|山羊|/ɡəʊt/|A goat.", "2-2-4|lamb|小羊|/læm/|Little lamb.", 
  "2-2-4|farm|农场|/fɑːm/|On the farm.", "2-2-4|animal|动物|/ˈænɪml/|Love animals.", "2-2-4|those|那些|/ðəʊz/|Those are sheep.",

  // G2 S2 U5: Clothes
  "2-2-5|clothes|衣服|/kləʊðz/|New clothes.", "2-2-5|pants|裤子|/pænts/|Blue pants.", "2-2-5|hat|帽子|/hæt/|My hat.", 
  "2-2-5|dress|连衣裙|/dres/|Pink dress.", "2-2-5|skirt|短裙|/skɜːt/|Red skirt.", "2-2-5|coat|外套|/kəʊt/|Warm coat.", 
  "2-2-5|sweater|毛衣|/ˈswetə/|White sweater.", "2-2-5|sock|袜子|/sɒk/|White socks.", "2-2-5|shorts|短裤|/ʃɔːts/|Summer shorts.", 
  "2-2-5|jacket|夹克|/ˈdʒækɪt/|Cool jacket.", "2-2-5|shirt|衬衫|/ʃɜːt/|Clean shirt.",

  // G2 S2 U6: Shopping
  "2-2-6|glove|手套|/ɡlʌv/|Warm gloves.", "2-2-6|scarf|围巾|/skɑːf/|Red scarf.", "2-2-6|umbrella|雨伞|/ʌmˈbrelə/|Take an umbrella.", 
  "2-2-6|sunglasses|太阳镜|/ˈsʌnɡlɑːsɪz/|Cool sunglasses.", "2-2-6|pretty|漂亮的|/ˈprɪti/|Pretty dress.", "2-2-6|expensive|贵的|/ɪkˈspensɪv/|Too expensive.", 
  "2-2-6|cheap|便宜的|/tʃiːp/|Very cheap.", "2-2-6|nice|好的|/naɪs/|Nice shoes.", "2-2-6|size|尺寸|/saɪz/|What size?", "2-2-6|try on|试穿|/traɪ/|Try it on.",


  // ================= GRADE 3 (Three) =================
  // G3 S1 U1: School (Review/Expand)
  "3-1-1|ruler|尺子|/ˈruːlə/|My ruler.", "3-1-1|pencil|铅笔|/ˈpensl/|A pencil.", "3-1-1|eraser|橡皮|/ɪˈreɪzə/|Rubber.", 
  "3-1-1|crayon|蜡笔|/ˈkreɪən/|Colour.", "3-1-1|bag|包|/bæɡ/|School bag.", "3-1-1|pen|钢笔|/pen/|Ink pen.", 
  "3-1-1|pencil box|铅笔盒|/bɒks/|Box.", "3-1-1|book|书|/bʊk/|Read.", "3-1-1|sharpener|卷笔刀|/ˈʃɑːpənə/|Sharpener.", "3-1-1|school|学校|/skuːl/|School.",

  // G3 S1 U2: Colors
  "3-1-2|red|红色|/red/|Red flag.", "3-1-2|green|绿色|/ɡriːn/|Green grass.", "3-1-2|yellow|黄色|/ˈjeləʊ/|Yellow light.", 
  "3-1-2|blue|蓝色|/bluː/|Blue sky.", "3-1-2|black|黑色|/blæk/|Blackboard.", "3-1-2|white|白色|/waɪt/|White cloud.", 
  "3-1-2|orange|橙色|/ˈɒrɪndʒ/|Orange juice.", "3-1-2|brown|棕色|/braʊn/|Brown dog.", "3-1-2|ok|好|/əʊˈkeɪ/|It's ok.", "3-1-2|mum|妈妈|/mʌm/|Mum.",

  // G3 S1 U3: Body
  "3-1-3|face|脸|/feɪs/|Face.", "3-1-3|ear|耳朵|/ɪə/|Ears.", "3-1-3|eye|眼睛|/aɪ/|Eyes.", "3-1-3|nose|鼻子|/nəʊz/|Nose.", 
  "3-1-3|mouth|嘴|/maʊθ/|Mouth.", "3-1-3|arm|胳膊|/ɑːm/|Arms.", "3-1-3|hand|手|/hænd/|Hands.", "3-1-3|head|头|/hed/|Head.", 
  "3-1-3|body|身体|/ˈbɒdi/|Body.", "3-1-3|leg|腿|/leɡ/|Legs.", "3-1-3|foot|脚|/fʊt/|Feet.", "3-1-3|school|学校|/skuːl/|School.",

  // G3 S1 U4: Animals
  "3-1-4|cat|猫|/kæt/|Cat.", "3-1-4|dog|狗|/dɒɡ/|Dog.", "3-1-4|bird|鸟|/bɜːd/|Bird.", "3-1-4|panda|熊猫|/ˈpændə/|Panda.", 
  "3-1-4|tiger|老虎|/ˈtaɪɡə/|Tiger.", "3-1-4|elephant|大象|/ˈelɪfənt/|Elephant.", "3-1-4|monkey|猴子|/ˈmʌŋki/|Monkey.", 
  "3-1-4|bear|熊|/beə/|Bear.", "3-1-4|pig|猪|/pɪɡ/|Pig.", "3-1-4|duck|鸭子|/dʌk/|Duck.", "3-1-4|funny|滑稽|/ˈfʌni/|Funny.",

  // G3 S1 U5: Food
  "3-1-5|bread|面包|/bred/|Bread.", "3-1-5|juice|果汁|/dʒuːs/|Juice.", "3-1-5|egg|蛋|/eɡ/|Egg.", "3-1-5|milk|牛奶|/mɪlk/|Milk.", 
  "3-1-5|water|水|/ˈwɔːtə/|Water.", "3-1-5|cake|蛋糕|/keɪk/|Cake.", "3-1-5|fish|鱼|/fɪʃ/|Fish.", "3-1-5|rice|米饭|/raɪs/|Rice.",
  "3-1-5|hungry|饿|/ˈhʌŋɡri/|Hungry.", "3-1-5|drink|喝|/drɪŋk/|Drink.",

  // G3 S1 U6: Numbers
  "3-1-6|one|一|/wʌn/|1.", "3-1-6|two|二|/tuː/|2.", "3-1-6|three|三|/θriː/|3.", "3-1-6|four|四|/fɔː/|4.", 
  "3-1-6|five|五|/faɪv/|5.", "3-1-6|six|六|/sɪks/|6.", "3-1-6|seven|七|/ˈsevn/|7.", "3-1-6|eight|八|/eɪt/|8.", 
  "3-1-6|nine|九|/naɪn/|9.", "3-1-6|ten|十|/ten/|10.", "3-1-6|brother|兄弟|/ˈbrʌðə/|Brother.", "3-1-6|plate|盘子|/pleɪt/|Plate.",

  // G3 S2 U1: Countries
  "3-2-1|UK|英国|/juː keɪ/|I am from the UK.", "3-2-1|Canada|加拿大|/ˈkænədə/|From Canada.", "3-2-1|USA|美国|/juː es eɪ/|From the USA.", 
  "3-2-1|China|中国|/ˈtʃaɪnə/|I am from China.", "3-2-1|student|学生|/ˈstjuːdnt/|Student.", "3-2-1|pupil|小学生|/ˈpjuːpl/|Pupil.", 
  "3-2-1|he|他|/hiː/|He is.", "3-2-1|she|她|/ʃiː/|She is.", "3-2-1|teacher|老师|/ˈtiːtʃə/|Teacher.", "3-2-1|boy|男孩|/bɔɪ/|Boy.", "3-2-1|girl|女孩|/ɡɜːl/|Girl.",

  // G3 S2 U2: Family
  "3-2-2|father|父亲|/ˈfɑːðə/|Father.", "3-2-2|dad|爸爸|/dæd/|Dad.", "3-2-2|mother|母亲|/ˈmʌðə/|Mother.", "3-2-2|mum|妈妈|/mʌm/|Mum.", 
  "3-2-2|man|男人|/mæn/|Man.", "3-2-2|woman|女人|/ˈwʊmən/|Woman.", "3-2-2|grandmother|奶奶|/ˈɡrænmʌðə/|Grandma.", 
  "3-2-2|grandfather|爷爷|/ˈɡrænfɑːðə/|Grandpa.", "3-2-2|sister|姐妹|/ˈsɪstə/|Sister.", "3-2-2|brother|兄弟|/ˈbrʌðə/|Brother.",

  // G3 S2 U3: Animals/Adj
  "3-2-3|thin|瘦的|/θɪn/|Thin.", "3-2-3|fat|胖的|/fæt/|Fat.", "3-2-3|tall|高的|/tɔːl/|Tall.", "3-2-3|short|矮的|/ʃɔːt/|Short.", 
  "3-2-3|long|长的|/lɒŋ/|Long.", "3-2-3|small|小的|/smɔːl/|Small.", "3-2-3|big|大的|/bɪɡ/|Big.", "3-2-3|giraffe|长颈鹿|/dʒəˈrɑːf/|Giraffe.", 
  "3-2-3|so|这么|/səʊ/|So tall.", "3-2-3|children|孩子|/ˈtʃɪldrən/|Children.", "3-2-3|tail|尾巴|/teɪl/|Tail.",

  // G3 S2 U4: Fruit
  "3-2-4|pear|梨|/peə/|Pear.", "3-2-4|apple|苹果|/ˈæpl/|Apple.", "3-2-4|orange|橙子|/ˈɒrɪndʒ/|Orange.", "3-2-4|banana|香蕉|/bəˈnɑːnə/|Banana.", 
  "3-2-4|watermelon|西瓜|/ˈwɔːtəmelən/|Watermelon.", "3-2-4|strawberry|草莓|/ˈstrɔːbəri/|Strawberry.", "3-2-4|grape|葡萄|/ɡreɪp/|Grape.", 
  "3-2-4|buy|买|/baɪ/|Buy.", "3-2-4|fruit|水果|/fruːt/|Fruit.",

  // G3 S2 U5: Position
  "3-2-5|desk|桌子|/desk/|Desk.", "3-2-5|chair|椅子|/tʃeə/|Chair.", "3-2-5|cap|帽子|/kæp/|Cap.", "3-2-5|ball|球|/bɔːl/|Ball.", 
  "3-2-5|car|车|/kɑː/|Car.", "3-2-5|boat|船|/bəʊt/|Boat.", "3-2-5|map|地图|/mæp/|Map.", "3-2-5|toy|玩具|/tɔɪ/|Toy.", 
  "3-2-5|box|盒子|/bɒks/|Box.", "3-2-5|in|在..里|/ɪn/|In.", "3-2-5|on|在..上|/ɒn/|On.", "3-2-5|under|在..下|/ˈʌndə/|Under.",

  // G3 S2 U6: Numbers
  "3-2-6|eleven|十一|/ɪˈlevn/|11.", "3-2-6|twelve|十二|/twelv/|12.", "3-2-6|thirteen|十三|/ˌθɜːˈtiːn/|13.", "3-2-6|fourteen|十四|/ˌfɔːˈtiːn/|14.", 
  "3-2-6|fifteen|十五|/ˌfɪfˈtiːn/|15.", "3-2-6|sixteen|十六|/ˌsɪksˈtiːn/|16.", "3-2-6|seventeen|十七|/ˌsevnˈtiːn/|17.", "3-2-6|eighteen|十八|/ˌeɪˈtiːn/|18.", 
  "3-2-6|nineteen|十九|/ˌnaɪnˈtiːn/|19.", "3-2-6|twenty|二十|/ˈtwenti/|20.", "3-2-6|kite|风筝|/kaɪt/|Kite.", "3-2-6|beautiful|美丽|/ˈbjuːtɪfl/|Beautiful.",


  // ================= GRADE 4 (Four) =================
  // G4 S1 U1: Classroom
  "4-1-1|classroom|教室|/ˈklɑːsruːm/|Big classroom.", "4-1-1|window|窗户|/ˈwɪndəʊ/|Clean window.", "4-1-1|door|门|/dɔː/|Green door.", 
  "4-1-1|picture|图片|/ˈpɪktʃə/|Nice picture.", "4-1-1|board|黑板|/bɔːd/|Blackboard.", "4-1-1|light|灯|/laɪt/|Turn on light.", 
  "4-1-1|floor|地板|/flɔː/|Sweep floor.", "4-1-1|computer|电脑|/kəmˈpjuːtə/|New computer.", "4-1-1|teacher's desk|讲台|/desk/|Teacher's desk.", 
  "4-1-1|wall|墙|/wɔːl/|White wall.", "4-1-1|fan|风扇|/fæn/|Cool fan.",

  // G4 S1 U2: Schoolbag
  "4-1-2|schoolbag|书包|/ˈskuːlbæɡ/|Heavy schoolbag.", "4-1-2|maths book|数学书|/mæθs/|Maths book.", "4-1-2|English book|英语书|/ˈɪŋɡlɪʃ/|English book.", 
  "4-1-2|Chinese book|语文书|/ˌtʃaɪˈniːz/|Chinese book.", "4-1-2|storybook|故事书|/ˈstɔːri/|Funny storybook.", "4-1-2|candy|糖果|/ˈkændi/|Sweet candy.", 
  "4-1-2|notebook|笔记本|/ˈnəʊtbʊk/|Blue notebook.", "4-1-2|toy|玩具|/tɔɪ/|Cute toy.", "4-1-2|key|钥匙|/kiː/|Lost key.", 
  "4-1-2|lost|丢失|/lɒst/|I lost it.",

  // G4 S1 U3: Friends
  "4-1-3|strong|强壮|/strɒŋ/|He is strong.", "4-1-3|friendly|友好的|/ˈfrendli/|She is friendly.", "4-1-3|quiet|安静|/ˈkwaɪət/|Be quiet.", 
  "4-1-3|hair|头发|/heə/|Long hair.", "4-1-3|shoe|鞋|/ʃuː/|New shoes.", "4-1-3|glasses|眼镜|/ˈɡlɑːsɪz/|Blue glasses.", 
  "4-1-3|his|他的|/hɪz/|His name.", "4-1-3|her|她的|/hə/|Her name.", "4-1-3|right|对的|/raɪt/|You are right.", 
  "4-1-3|hat|帽子|/hæt/|A hat.",

  // G4 S1 U4: Home
  "4-1-4|bedroom|卧室|/ˈbedruːm/|My bedroom.", "4-1-4|living room|客厅|/ˈlɪvɪŋ/|Big living room.", "4-1-4|study|书房|/ˈstʌdi/|Small study.", 
  "4-1-4|kitchen|厨房|/ˈkɪtʃɪn/|Clean kitchen.", "4-1-4|bathroom|浴室|/ˈbɑːθruːm/|Nice bathroom.", "4-1-4|bed|床|/bed/|Soft bed.", 
  "4-1-4|phone|电话|/fəʊn/|Phone call.", "4-1-4|table|桌子|/ˈteɪbl/|Round table.", "4-1-4|sofa|沙发|/ˈsəʊfə/|Blue sofa.", 
  "4-1-4|fridge|冰箱|/frɪdʒ/|Full fridge.",

  // G4 S1 U5: Dinner
  "4-1-5|beef|牛肉|/biːf/|Cook beef.", "4-1-5|chicken|鸡肉|/ˈtʃɪkɪn/|Roast chicken.", "4-1-5|noodles|面条|/ˈnuːdlz/|Yummy noodles.", 
  "4-1-5|soup|汤|/suːp/|Hot soup.", "4-1-5|vegetable|蔬菜|/ˈvedʒtəbl/|Eat vegetable.", "4-1-5|chopsticks|筷子|/ˈtʃɒpstɪks/|Chopsticks.", 
  "4-1-5|bowl|碗|/bəʊl/|Small bowl.", "4-1-5|spoon|勺子|/spuːn/|Silver spoon.", "4-1-5|knife|刀|/naɪf/|Knife.", 
  "4-1-5|fork|叉|/fɔːk/|Fork.", "4-1-5|dinner|晚餐|/ˈdɪnə/|Big dinner.",

  // G4 S1 U6: Jobs
  "4-1-6|doctor|医生|/ˈdɒktə/|Doctor.", "4-1-6|nurse|护士|/nɜːs/|Nurse.", "4-1-6|driver|司机|/ˈdraɪvə/|Driver.", 
  "4-1-6|farmer|农民|/ˈfɑːmə/|Farmer.", "4-1-6|cook|厨师|/kʊk/|Cook.", "4-1-6|football player|足球员|/ˈpleɪə/|Player.", 
  "4-1-6|nurse|护士|/nɜːs/|Nurse.", "4-1-6|people|人们|/ˈpiːpl/|Many people.", "4-1-6|puppy|小狗|/ˈpʌpi/|Little puppy.", 
  "4-1-6|job|工作|/dʒɒb/|Good job.",

  // G4 S2 U1: School Places
  "4-2-1|playground|操场|/ˈpleɪɡraʊnd/|Big playground.", "4-2-1|library|图书馆|/ˈlaɪbrəri/|Quiet library.", "4-2-1|art room|美术室|/ɑːt/|Art room.", 
  "4-2-1|music room|音乐室|/ˈmjuːzɪk/|Music room.", "4-2-1|first floor|一楼|/fɜːst/|First floor.", "4-2-1|second floor|二楼|/ˈsekənd/|Second floor.", 
  "4-2-1|teachers' office|教师办|/ˈɒfɪs/|Office.", "4-2-1|gym|体育馆|/dʒɪm/|Go to gym.", "4-2-1|homework|作业|/ˈhəʊmwɜːk/|Do homework.", 
  "4-2-1|next to|旁边|/nekst/|Next to.",

  // G4 S2 U2: Time/Schedule
  "4-2-2|breakfast|早餐|/ˈbrekfəst/|Breakfast time.", "4-2-2|lunch|午餐|/lʌntʃ/|Lunch time.", "4-2-2|dinner|晚餐|/ˈdɪnə/|Dinner time.", 
  "4-2-2|English class|英语课|/ˈɪŋɡlɪʃ/|English class.", "4-2-2|music class|音乐课|/ˈmjuːzɪk/|Singing.", "4-2-2|PE class|体育课|/piː iː/|Running.", 
  "4-2-2|get up|起床|/ɡet ʌp/|Get up now.", "4-2-2|go to school|上学|/skuːl/|Go to school.", "4-2-2|go home|回家|/həʊm/|Go home.", 
  "4-2-2|go to bed|睡觉|/bed/|Sleep.", "4-2-2|o'clock|点钟|/əˈklɒk/|7 o'clock.",

  // G4 S2 U3: Weather
  "4-2-3|cold|冷|/kəʊld/|Very cold.", "4-2-3|hot|热|/hɒt/|So hot.", "4-2-3|cool|凉爽|/kuːl/|Cool wind.", 
  "4-2-3|warm|暖和|/wɔːm/|Warm sun.", "4-2-3|sunny|晴朗|/ˈsʌni/|Sunny.", "4-2-3|rainy|下雨|/ˈreɪni/|Rainy.", 
  "4-2-3|windy|有风|/ˈwɪndi/|Windy.", "4-2-3|cloudy|多云|/ˈklaʊdi/|Cloudy.", "4-2-3|snowy|下雪|/ˈsnəʊi/|Snowy.", 
  "4-2-3|outside|外面|/ˌaʊtˈsaɪd/|Go outside.", "4-2-3|weather|天气|/ˈweðə/|Weather report.",

  // G4 S2 U4: Farm
  "4-2-4|tomato|西红柿|/təˈmɑːtəʊ/|Red tomato.", "4-2-4|potato|土豆|/pəˈteɪtəʊ/|Potato chips.", "4-2-4|green beans|豆角|/biːnz/|Beans.", 
  "4-2-4|carrot|胡萝卜|/ˈkærət/|Carrot cake.", "4-2-4|horse|马|/hɔːs/|Run horse.", "4-2-4|cow|母牛|/kaʊ/|Milk cow.", 
  "4-2-4|sheep|绵羊|/ʃiːp/|Wool sheep.", "4-2-4|hen|母鸡|/hen/|Cluck hen.", "4-2-4|these|这些|/ðiːz/|These are.", 
  "4-2-4|those|那些|/ðəʊz/|Those are.", "4-2-4|animal|动物|/ˈænɪml/|Animal.",

  // G4 S2 U5: Clothes
  "4-2-5|clothes|衣服|/kləʊðz/|Clothes.", "4-2-5|pants|裤子|/pænts/|Pants.", "4-2-5|hat|帽子|/hæt/|Hat.", 
  "4-2-5|dress|连衣裙|/dres/|Dress.", "4-2-5|skirt|短裙|/skɜːt/|Skirt.", "4-2-5|coat|外套|/kəʊt/|Coat.", 
  "4-2-5|sweater|毛衣|/ˈswetə/|Sweater.", "4-2-5|sock|袜子|/sɒk/|Sock.", "4-2-5|shorts|短裤|/ʃɔːts/|Shorts.", 
  "4-2-5|jacket|夹克|/ˈdʒækɪt/|Jacket.", "4-2-5|shirt|衬衫|/ʃɜːt/|Shirt.", "4-2-5|yours|你的|/jɔːz/|It is yours.", "4-2-5|mine|我的|/maɪn/|It is mine.",

  // G4 S2 U6: Shopping
  "4-2-6|glove|手套|/ɡlʌv/|Gloves.", "4-2-6|scarf|围巾|/skɑːf/|Scarf.", "4-2-6|umbrella|雨伞|/ʌmˈbrelə/|Umbrella.", 
  "4-2-6|sunglasses|太阳镜|/ˈsʌnɡlɑːsɪz/|Sun glasses.", "4-2-6|pretty|漂亮的|/ˈprɪti/|Pretty.", "4-2-6|expensive|贵的|/ɪkˈspensɪv/|Expensive.", 
  "4-2-6|cheap|便宜的|/tʃiːp/|Cheap.", "4-2-6|nice|好的|/naɪs/|Nice.", "4-2-6|size|尺寸|/saɪz/|Size.", 
  "4-2-6|try on|试穿|/traɪ/|Try on.", "4-2-6|how much|多少钱|/haʊ mʌtʃ/|How much?",


  // ================= GRADE 5 (Five) =================
  // G5 S1 U1: Character
  "5-1-1|old|老的|/əʊld/|Old man.", "5-1-1|young|年轻|/jʌŋ/|Young girl.", "5-1-1|funny|滑稽|/ˈfʌni/|Funny clown.", 
  "5-1-1|kind|和蔼|/kaɪnd/|Kind teacher.", "5-1-1|strict|严厉|/strɪkt/|Strict boss.", "5-1-1|polite|有礼貌|/pəˈlaɪt/|Polite boy.", 
  "5-1-1|hard-working|勤奋|/ˈwɜːkɪŋ/|Work hard.", "5-1-1|helpful|乐于助人|/ˈhelpfl/|Helpful.", "5-1-1|clever|聪明|/ˈklevə/|Clever dog.", 
  "5-1-1|shy|害羞|/ʃaɪ/|Shy girl.", "5-1-1|know|知道|/nəʊ/|I know.",

  // G5 S1 U2: Days
  "5-1-2|Monday|星期一|/ˈmʌndeɪ/|Mon.", "5-1-2|Tuesday|星期二|/ˈtjuːzdeɪ/|Tue.", "5-1-2|Wednesday|星期三|/ˈwenzdeɪ/|Wed.", 
  "5-1-2|Thursday|星期四|/ˈθɜːzdeɪ/|Thu.", "5-1-2|Friday|星期五|/ˈfraɪdeɪ/|Fri.", "5-1-2|Saturday|星期六|/ˈsætədeɪ/|Sat.", 
  "5-1-2|Sunday|星期日|/ˈsʌndeɪ/|Sun.", "5-1-2|weekend|周末|/ˌwiːkˈend/|Happy weekend.", "5-1-2|wash|洗|/wɒʃ/|Wash clothes.", 
  "5-1-2|watch|看|/wɒtʃ/|Watch TV.",

  // G5 S1 U3: Food/Drink
  "5-1-3|sandwich|三明治|/ˈsænwɪdʒ/|Sandwich.", "5-1-3|salad|沙拉|/ˈsæləd/|Salad.", "5-1-3|hamburger|汉堡|/ˈhæmbɜːɡə/|Burger.", 
  "5-1-3|ice cream|冰淇淋|/aɪs kriːm/|Ice cream.", "5-1-3|tea|茶|/tiː/|Green tea.", "5-1-3|fresh|新鲜|/freʃ/|Fresh fruit.", 
  "5-1-3|healthy|健康|/ˈhelθi/|Healthy food.", "5-1-3|delicious|美味|/dɪˈlɪʃəs/|Delicious.", "5-1-3|hot|辣/热|/hɒt/|Hot soup.", 
  "5-1-3|sweet|甜|/swiːt/|Sweet candy.", "5-1-3|favourite|最爱|/ˈfeɪvərɪt/|Favourite.",

  // G5 S1 U4: Hobbies/Abilities
  "5-1-4|sing|唱|/sɪŋ/|Sing a song.", "5-1-4|song|歌|/sɒŋ/|Nice song.", "5-1-4|dance|跳舞|/dɑːns/|Can dance.", 
  "5-1-4|draw|画|/drɔː/|Draw picture.", "5-1-4|cartoon|漫画|/kɑːˈtuːn/|Watch cartoon.", "5-1-4|kung fu|功夫|/kʌŋ fuː/|Kung fu.", 
  "5-1-4|swim|游泳|/swɪm/|Swim fast.", "5-1-4|play|玩|/pleɪ/|Play ball.", "5-1-4|speak|说|/spiːk/|Speak English.", 
  "5-1-4|cook|烹饪|/kʊk/|Can cook.", "5-1-4|party|聚会|/ˈpɑːti/|Birthday party.",

  // G5 S1 U5: House/Objects
  "5-1-5|clock|钟|/klɒk/|Clock.", "5-1-5|plant|植物|/plɑːnt/|Green plant.", "5-1-5|photo|照片|/ˈfəʊtəʊ/|Nice photo.", 
  "5-1-5|water bottle|水瓶|/ˈwɔːtə/|Water bottle.", "5-1-5|bike|自行车|/baɪk/|Ride bike.", "5-1-5|in front of|在..前|/frʌnt/|Front.", 
  "5-1-5|beside|在..旁|/bɪˈsaɪd/|Beside me.", "5-1-5|between|在..中间|/bɪˈtwiːn/|Between us.", "5-1-5|behind|在..后|/bɪˈhaɪnd/|Behind you.", 
  "5-1-5|above|在..上|/əˈbʌv/|Above head.", "5-1-5|grandparents|祖父母|/ˈɡrænpeərənts/|Love grandparents.",

  // G5 S1 U6: Nature
  "5-1-6|forest|森林|/ˈfɒrɪst/|Big forest.", "5-1-6|river|河流|/ˈrɪvə/|Long river.", "5-1-6|lake|湖泊|/leɪk/|Blue lake.", 
  "5-1-6|mountain|高山|/ˈmaʊntən/|High mountain.", "5-1-6|hill|小山|/hɪl/|Small hill.", "5-1-6|tree|树|/triː/|Tall tree.", 
  "5-1-6|bridge|桥|/brɪdʒ/|Old bridge.", "5-1-6|building|建筑|/ˈbɪldɪŋ/|Tall building.", "5-1-6|village|村庄|/ˈvɪlɪdʒ/|Small village.", 
  "5-1-6|house|房子|/haʊs/|Nice house.",

  // G5 S2 U1: Daily Routine
  "5-2-1|do morning exercises|做早操|/duː/|Exercises.", "5-2-1|eat breakfast|吃早饭|/iːt/|Breakfast.", "5-2-1|have class|上课|/hæv/|Class.", 
  "5-2-1|play sports|运动|/pleɪ/|Sports.", "5-2-1|eat dinner|吃晚饭|/dɪnə/|Dinner.", "5-2-1|clean my room|扫地|/kliːn/|Clean.", 
  "5-2-1|go for a walk|散步|/wɔːk/|Walk.", "5-2-1|go shopping|购物|/ˈʃɒpɪŋ/|Shop.", "5-2-1|take a dancing class|上舞蹈课|/dɑːns/|Dance.", 
  "5-2-1|when|什么时候|/wen/|When?", "5-2-1|start|开始|/stɑːt/|Start.",

  // G5 S2 U2: Seasons
  "5-2-2|spring|春天|/sprɪŋ/|Spring.", "5-2-2|summer|夏天|/ˈsʌmə/|Summer.", "5-2-2|autumn|秋天|/ˈɔːtəm/|Autumn.", 
  "5-2-2|winter|冬天|/ˈwɪntə/|Winter.", "5-2-2|season|季节|/ˈsiːzn/|Season.", "5-2-2|picnic|野餐|/ˈpɪknɪk/|Picnic.", 
  "5-2-2|pick apples|摘苹果|/pɪk/|Pick.", "5-2-2|snowman|雪人|/ˈsnəʊmæn/|Snowman.", "5-2-2|go swimming|去游泳|/swɪm/|Swim.", 
  "5-2-2|best|最好的|/best/|Best.", "5-2-2|vacation|假期|/vəˈkeɪʃn/|Vacation.",

  // G5 S2 U3: Months
  "5-2-3|January|一月|/ˈdʒænjuəri/|Jan.", "5-2-3|February|二月|/ˈfebruəri/|Feb.", "5-2-3|March|三月|/mɑːtʃ/|Mar.", 
  "5-2-3|April|四月|/ˈeɪprəl/|Apr.", "5-2-3|May|五月|/meɪ/|May.", "5-2-3|June|六月|/dʒuːn/|Jun.", 
  "5-2-3|July|七月|/dʒuˈlaɪ/|Jul.", "5-2-3|August|八月|/ɔːˈɡʌst/|Aug.", "5-2-3|September|九月|/sepˈtembə/|Sep.", 
  "5-2-3|October|十月|/ɒkˈtəʊbə/|Oct.", "5-2-3|November|十一月|/nəʊˈvembə/|Nov.", "5-2-3|December|十二月|/dɪˈsembə/|Dec.",

  // G5 S2 U4: Ordinals
  "5-2-4|first|第一|/fɜːst/|1st.", "5-2-4|second|第二|/ˈsekənd/|2nd.", "5-2-4|third|第三|/θɜːd/|3rd.", 
  "5-2-4|fourth|第四|/fɔːθ/|4th.", "5-2-4|fifth|第五|/fɪfθ/|5th.", "5-2-4|twelfth|第12|/twelfθ/|12th.", 
  "5-2-4|twentieth|第20|/ˈtwentiəθ/|20th.", "5-2-4|twenty-first|第21|/fɜːst/|21st.", "5-2-4|birthday|生日|/ˈbɜːθdeɪ/|Birthday.", 
  "5-2-4|special|特别的|/ˈspeʃl/|Special day.",

  // G5 S2 U5: Verbs (ing)
  "5-2-5|climbing|攀爬|/klaɪmɪŋ/|Climbing.", "5-2-5|eating|吃|/iːtɪŋ/|Eating.", "5-2-5|playing|玩|/pleɪɪŋ/|Playing.", 
  "5-2-5|jumping|跳|/dʒʌmpɪŋ/|Jumping.", "5-2-5|drinking|喝|/drɪŋkɪŋ/|Drinking.", "5-2-5|sleeping|睡|/sliːpɪŋ/|Sleeping.", 
  "5-2-5|running|跑|/rʌnɪŋ/|Running.", "5-2-5|walking|走|/wɔːkɪŋ/|Walking.", "5-2-5|flying|飞|/flaɪɪŋ/|Flying.", 
  "5-2-5|swimming|游|/swɪmɪŋ/|Swimming.",

  // G5 S2 U6: Verbs (ing) Part 2
  "5-2-6|doing|做|/duːɪŋ/|Doing.", "5-2-6|having|有|/hævɪŋ/|Having.", "5-2-6|reading|读|/riːdɪŋ/|Reading.", 
  "5-2-6|listening|听|/lɪsnɪŋ/|Listening.", "5-2-6|watching|看|/wɒtʃɪŋ/|Watching.", "5-2-6|writing|写|/raɪtɪŋ/|Writing.", 
  "5-2-6|working|工作|/wɜːkɪŋ/|Working.", "5-2-6|cleaning|打扫|/kliːnɪŋ/|Cleaning.", "5-2-6|morning|早上|/ˈmɔːnɪŋ/|Morning.", 
  "5-2-6|noon|中午|/nuːn/|Noon.",


  // ================= GRADE 6 (Six) =================
  // G6 S1 U1: Places & Directions
  "6-1-1|science museum|科学博物馆|/mjuˈziːəm/|Museum.", "6-1-1|post office|邮局|/ˈpəʊst/|Post.", "6-1-1|bookstore|书店|/ˈbʊkstɔː/|Bookstore.", 
  "6-1-1|cinema|电影院|/ˈsɪnəmə/|Cinema.", "6-1-1|hospital|医院|/ˈhɒspɪtl/|Hospital.", "6-1-1|crossing|十字路口|/ˈkrɒsɪŋ/|Crossing.", 
  "6-1-1|turn left|左转|/tɜːn/|Left.", "6-1-1|turn right|右转|/raɪt/|Right.", "6-1-1|go straight|直走|/streɪt/|Straight.", 
  "6-1-1|near|附近|/nɪə/|Near.", "6-1-1|next to|旁边|/nekst/|Next.",

  // G6 S1 U2: Transport
  "6-1-2|on foot|走路|/fʊt/|On foot.", "6-1-2|by bus|乘公车|/bʌs/|By bus.", "6-1-2|by taxi|乘出租|/ˈtæksi/|By taxi.", 
  "6-1-2|by ship|乘船|/ʃɪp/|By ship.", "6-1-2|by subway|乘地铁|/ˈsʌbweɪ/|Subway.", "6-1-2|by train|乘火车|/treɪn/|Train.", 
  "6-1-2|by plane|乘飞机|/pleɪn/|Plane.", "6-1-2|slow down|慢点|/sləʊ/|Slow.", "6-1-2|stop|停|/stɒp/|Stop.", 
  "6-1-2|wait|等|/weɪt/|Wait.", "6-1-2|traffic|交通|/ˈtræfɪk/|Traffic light.",

  // G6 S1 U3: Future Plans
  "6-1-3|visit|拜访|/ˈvɪzɪt/|Visit.", "6-1-3|film|电影|/fɪlm/|Film.", "6-1-3|trip|旅行|/trɪp/|Trip.", 
  "6-1-3|supermarket|超市|/ˈsuːpəmɑːkɪt/|Shop.", "6-1-3|evening|晚上|/ˈiːvnɪŋ/|Evening.", "6-1-3|tonight|今晚|/təˈnaɪt/|Tonight.", 
  "6-1-3|tomorrow|明天|/təˈmɒrəʊ/|Tomorrow.", "6-1-3|next week|下周|/wiːk/|Next week.", "6-1-3|dictionary|字典|/ˈdɪkʃənri/|Book.", 
  "6-1-3|comic book|漫画书|/ˈkɒmɪk/|Comic.", "6-1-3|postcard|明信片|/ˈpəʊstkɑːd/|Card.",

  // G6 S1 U4: Hobbies
  "6-1-4|studies|学习(三单)|/stʌdiz/|Studies.", "6-1-4|puzzle|拼图|/ˈpʌzl/|Puzzle.", "6-1-4|hiking|远足|/ˈhaɪkɪŋ/|Hiking.", 
  "6-1-4|pen pal|笔友|/pen/|Pen pal.", "6-1-4|hobby|爱好|/ˈhɒbi/|Hobby.", "6-1-4|jasmine|茉莉|/ˈdʒæzmɪn/|Jasmine.", 
  "6-1-4|idea|主意|/aɪˈdɪə/|Idea.", "6-1-4|singing|唱(ing)|/sɪŋɪŋ/|Singing.", "6-1-4|dancing|舞(ing)|/dɑːnsɪŋ/|Dancing.", 
  "6-1-4|reading|读(ing)|/riːdɪŋ/|Reading.", "6-1-4|football|足球|/ˈfʊtbɔːl/|Football.",

  // G6 S1 U5: Jobs
  "6-1-5|factory|工厂|/ˈfæktri/|Factory.", "6-1-5|worker|工人|/ˈwɜːkə/|Worker.", "6-1-5|postman|邮递员|/ˈpəʊstmən/|Postman.", 
  "6-1-5|businessman|商人|/ˈbɪznəsmən/|Business.", "6-1-5|police officer|警察|/pəˈliːs/|Police.", "6-1-5|fisherman|渔夫|/ˈfɪʃəmən/|Fish.", 
  "6-1-5|scientist|科学家|/ˈsaɪəntɪst/|Science.", "6-1-5|pilot|飞行员|/ˈpaɪlət/|Pilot.", "6-1-5|coach|教练|/kəʊtʃ/|Coach.", 
  "6-1-5|country|国家|/ˈkʌntri/|Country.",

  // G6 S1 U6: Feelings
  "6-1-6|angry|生气|/ˈæŋɡri/|Angry.", "6-1-6|afraid|害怕|/əˈfreɪd/|Afraid.", "6-1-6|sad|难过|/sæd/|Sad.", 
  "6-1-6|worried|担心|/ˈwʌrid/|Worried.", "6-1-6|happy|快乐|/ˈhæpi/|Happy.", "6-1-6|wear|穿|/weə/|Wear.", 
  "6-1-6|more|更多|/mɔː/|More.", "6-1-6|deep|深|/diːp/|Deep.", "6-1-6|breath|呼吸|/breθ/|Breath.", 
  "6-1-6|count|数数|/kaʊnt/|Count.", "6-1-6|should|应该|/ʃʊd/|Should.",

  // G6 S2 U1: Comparisons
  "6-2-1|younger|更年轻|/ˈjʌŋɡə/|Younger.", "6-2-1|older|更老|/ˈəʊldə/|Older.", "6-2-1|taller|更高|/ˈtɔːlə/|Taller.", 
  "6-2-1|shorter|更矮|/ˈʃɔːtə/|Shorter.", "6-2-1|longer|更长|/ˈlɒŋɡə/|Longer.", "6-2-1|thinner|更瘦|/ˈθɪnə/|Thinner.", 
  "6-2-1|heavier|更重|/ˈheviə/|Heavier.", "6-2-1|bigger|更大|/ˈbɪɡə/|Bigger.", "6-2-1|smaller|更小|/ˈsmɔːlə/|Smaller.", 
  "6-2-1|stronger|更强|/ˈstrɒŋɡə/|Stronger.", "6-2-1|dinosaur|恐龙|/ˈdaɪnəsɔː/|Dinosaur.",

  // G6 S2 U2: Past Tense
  "6-2-2|cleaned|打扫(过)|/kliːnd/|Cleaned.", "6-2-2|stayed|逗留(过)|/steɪd/|Stayed.", "6-2-2|washed|洗(过)|/wɒʃt/|Washed.", 
  "6-2-2|watched|看(过)|/wɒtʃt/|Watched.", "6-2-2|had|有(过)|/hæd/|Had.", "6-2-2|slept|睡(过)|/slept/|Slept.", 
  "6-2-2|read|读(过)|/red/|Read.", "6-2-2|saw|看(过)|/sɔː/|Saw.", "6-2-2|last|上一个|/lɑːst/|Last.", 
  "6-2-2|weekend|周末|/ˌwiːkˈend/|Weekend.", "6-2-2|yesterday|昨天|/ˈjestədeɪ/|Yesterday.",

  // G6 S2 U3: Past Tense 2
  "6-2-3|went|去(过)|/went/|Went.", "6-2-3|camp|野营|/kæmp/|Camp.", "6-2-3|fish|钓鱼|/fɪʃ/|Fish.", 
  "6-2-3|rode|骑(过)|/rəʊd/|Rode.", "6-2-3|hurt|受伤(过)|/hɜːt/|Hurt.", "6-2-3|ate|吃(过)|/et/|Ate.", 
  "6-2-3|took|拍(过)|/tʊk/|Took.", "6-2-3|bought|买(过)|/bɔːt/|Bought.", "6-2-3|gift|礼物|/ɡɪft/|Gift.", 
  "6-2-3|picture|照片|/ˈpɪktʃə/|Picture.", "6-2-3|basket|篮子|/ˈbɑːskɪt/|Basket.",

  // G6 S2 U4: Changes
  "6-2-4|gym|体育馆|/dʒɪm/|Gym.", "6-2-4|grass|草地|/ɡrɑːs/|Grass.", "6-2-4|dining hall|食堂|/ˈdaɪnɪŋ/|Hall.", 
  "6-2-4|cycling|骑车|/ˈsaɪklɪŋ/|Cycling.", "6-2-4|ice-skate|滑冰|/aɪs skeɪt/|Skate.", "6-2-4|badminton|羽毛球|/ˈbædmɪntən/|Badminton.", 
  "6-2-4|star|星|/stɑː/|Star.", "6-2-4|easy|容易|/ˈiːzi/|Easy.", "6-2-4|look up|查阅|/lʊk/|Look up.", 
  "6-2-4|internet|网络|/ˈɪntənet/|Net.", "6-2-4|ago|以前|/əˈɡəʊ/|Years ago.",

  // G6 S2 U5: General Review 1
  "6-2-5|bag|包|/bæɡ/|Bag.", "6-2-5|pencil|铅笔|/ˈpensl/|Pencil.", "6-2-5|pen|钢笔|/pen/|Pen.", 
  "6-2-5|book|书|/bʊk/|Book.", "6-2-5|ruler|尺子|/ˈruːlə/|Ruler.", "6-2-5|teacher|老师|/ˈtiːtʃə/|Teacher.", 
  "6-2-5|student|学生|/ˈstjuːdnt/|Student.", "6-2-5|music|音乐|/ˈmjuːzɪk/|Music.", "6-2-5|art|美术|/ɑːt/|Art.", 
  "6-2-5|computer|电脑|/kəmˈpjuːtə/|Computer.", "6-2-5|game|游戏|/ɡeɪm/|Game.",

  // G6 S2 U6: General Review 2
  "6-2-6|middle school|中学|/ˈmɪdl/|Middle.", "6-2-6|study|学习|/ˈstʌdi/|Study.", "6-2-6|practise|练习|/ˈpræktɪs/|Practise.", 
  "6-2-6|worry|担心|/ˈwʌri/|Worry.", "6-2-6|goodbye|再见|/ɡʊdˈbaɪ/|Bye.", "6-2-6|letter|信|/ˈletə/|Letter.", 
  "6-2-6|keep|保持|/kiːp/|Keep.", "6-2-6|email|邮件|/ˈiːmeɪl/|Email.", "6-2-6|address|地址|/əˈdres/|Address.", 
  "6-2-6|number|号码|/ˈnʌmbə/|Number.", "6-2-6|luck|运气|/lʌk/|Good luck."
];

export const INITIAL_WORDS: Word[] = parse(RAW_VOCAB);

export const GRADES = [1, 2, 3, 4, 5, 6] as const;
export const UNITS = [1, 2, 3, 4, 5, 6]; 
