/* ========================================
   12컷 — Landing Page Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== BRAND LOGO (inline SVG, themeable via CSS variables) =====
    const LOGO_SVG = '<svg class="hero__title-logo" role="img" aria-label="12CUT" viewBox="0 0 64.79 46.81" xmlns="http://www.w3.org/2000/svg" focusable="false"><path class="hero__title-logo-bg" d="M47.31.37l-13.52,7.65c-.87.49-1.93.49-2.79,0L17.48.37c-.91-.52-2.04-.49-2.92.08L1.31,8.93c-.81.52-1.31,1.42-1.31,2.39v14.49c0,.98.51,1.9,1.35,2.42l29.56,18.18c.91.56,2.06.56,2.97,0l29.56-18.18c.84-.52,1.35-1.43,1.35-2.42v-14.49c0-.97-.49-1.87-1.31-2.39L50.23.45c-.89-.57-2.01-.6-2.92-.08"/><path class="hero__title-logo-fg" d="M27.66,22.26c0-1.31.39-2.38,1.18-3.2.79-.82,1.82-1.23,3.11-1.23.83,0,1.5.15,2.02.44s.77.68.77,1.16c0,.3-.1.56-.29.76-.2.2-.44.3-.74.3-.13,0-.39-.06-.78-.19-.39-.13-.72-.19-.97-.19-.52,0-.93.19-1.25.58-.32.39-.48.89-.48,1.52s.16,1.17.49,1.54c.32.37.77.56,1.33.56.27,0,.6-.06.98-.19.38-.13.62-.19.74-.19.27,0,.5.1.69.31s.28.46.28.77c0,.46-.28.85-.84,1.17-.56.32-1.26.49-2.09.49-1.23,0-2.22-.41-2.99-1.22-.76-.82-1.15-1.88-1.15-3.19Z"/><path class="hero__title-logo-fg" d="M36.85,23.07v-3.32c0-.61.1-1.07.31-1.36.21-.3.52-.44.94-.44s.73.15.93.44.31.75.31,1.36v2.81c0,.66.1,1.13.3,1.41.2.28.53.41.98.41s.78-.14.98-.41c.2-.28.3-.75.3-1.41v-2.81c0-.61.1-1.07.31-1.36s.52-.44.95-.44.73.15.93.44c.2.29.3.75.3,1.37v3.32c0,1.18-.32,2.09-.97,2.72-.64.63-1.58.94-2.8.94s-2.15-.31-2.8-.94c-.65-.63-.97-1.53-.97-2.72Z"/><path class="hero__title-logo-fg" d="M15.69,25.73c0,.61-.11,1.07-.32,1.37-.21.3-.54.45-.98.45s-.76-.15-.98-.45c-.21-.3-.32-.75-.32-1.37v-7.17h-.23c-.57,0-1-.1-1.29-.3s-.44-.5-.44-.89.15-.69.45-.89c.3-.2.76-.29,1.37-.29h1.28c.52,0,.89.14,1.12.42s.34.74.34,1.4v7.73Z"/><path class="hero__title-logo-fg" d="M24.33,25.06c.61,0,1.07.1,1.37.29s.45.49.45.89-.15.7-.45.9c-.3.2-.75.29-1.37.29h-4.54c-.52,0-.91-.1-1.16-.29-.25-.2-.38-.49-.38-.9,0-.36.52-1.1,1.55-2.23.21-.23.37-.4.49-.53,1.14-1.25,1.9-2.16,2.28-2.74.38-.57.57-1.04.57-1.41,0-.31-.09-.57-.27-.77-.18-.2-.41-.3-.69-.3-.26,0-.49.1-.7.3s-.38.49-.52.86c-.19.52-.37.87-.54,1.04-.18.17-.41.26-.7.26-.38,0-.68-.12-.92-.36-.23-.24-.35-.56-.35-.95,0-.32.07-.67.22-1.05.14-.38.33-.72.57-1.02.38-.47.83-.83,1.34-1.08.52-.25,1.07-.37,1.68-.37,1.07,0,1.93.31,2.6.94.67.63,1,1.43,1,2.4,0,.73-.25,1.5-.76,2.3-.51.8-1.55,1.99-3.13,3.55h2.36Z"/><path class="hero__title-logo-fg" d="M50.58,16.36c-.2-.3-.51-.45-.93-.45s-.74.15-.94.45c-.21.3-.31.75-.31,1.37v7.7c0,.61.1,1.07.31,1.37.21.3.52.45.94.45s.73-.15.93-.44c.2-.3.3-.75.3-1.37v-7.7c0-.61-.1-1.07-.31-1.37Z"/><rect class="hero__title-logo-fg" x="45.63" y="19.21" width="8.02" height="2.37" rx="1.18" ry="1.18"/></svg>';

    // ===== i18n TRANSLATIONS =====
    const translations = {
        en: {
            nav_gallery: 'Gallery', nav_product: 'Product', nav_how: 'How It Works', nav_pricing: 'Pricing',
            cta: 'Make Your Story',
            hero_eyebrow: 'Film Slide Viewer',
            hero_title: `12 happy memories<br>held in warm light,<br>${LOGO_SVG}`,
            manifesto_1: 'among thousands of photos, how many moments truly mattered?',
            manifesto_2: '12cut preserves those moments in a retro-inspired viewer. film slides that come alive in the light, memories you can hold in your hands.',
            manifesto_3: 'each frame connects past and present. your own time capsule, 12cut.',
            examples_title: 'Stories captured in 12 cuts',
            examples_desc: 'Any moment becomes special when kept in 12 cuts.',
            examples_kw_couple: 'Couple', examples_kw_family: 'Family', examples_kw_pet: 'Pets', examples_kw_travel: 'Travel', examples_kw_graduation: 'Graduation', examples_kw_birthday: 'Birthday', examples_kw_daily: 'Everyday', examples_kw_friendship: 'Friendship', examples_kw_anniversary: 'Anniversary', examples_kw_growth: 'Growth',
            product_section_title: 'Meet the 12cut viewer',
            product_section_desc: 'A timeless way to hold your memories — one cut at a time.',
            product_price: '₩70,000', product_buy: 'Buy Now',
            how_title: 'How to make your 12 cuts',
            how_desc: 'Complete your own time capsule in three simple steps.',
            how_s1_title: 'Select 12 Photos', how_s1_desc: 'Click the \'slide thumbnail\' and<br>select your photos.<br><br>Create your own story with<br>the moments to share and keep.',
            how_s2_title: 'Arrange the Order', how_s2_desc: 'Set the order of the photos<br>in your slides.<br><br>It doesn\'t have to be chronological.<br>Connect them by the flow of emotions.',
            how_s3_title: 'Trim & Adjust', how_s3_desc: 'For a better story,<br>trim each scene<br>to perfection.<br><br>Use zoom and rotation to<br>highlight the important moments.',
            how_result: 'Your finished 12 cuts arrive in a vintage viewer.',
            testimonials_title: 'People who met 12cut',
            review_1_text: '"I put our one-year memories into 12 cuts for my boyfriend\'s birthday. He held the viewer up and cried going through each frame. A digital album could never create that kind of emotion."',
            review_1_name: 'Jieun', review_1_type: 'Couple 12cut',
            review_2_text: '"I captured my baby\'s first year, and viewing them on film felt like real time travel. I gifted it to the grandparents — they look at it every day."',
            review_2_name: 'Minsu\'s Dad', review_2_type: 'Baby 12cut',
            review_3_text: '"Condensing a month in Europe into 12 photos actually made the memories clearer. I keep the viewer on my desk and peek through it sometimes."',
            review_3_name: 'Hyunwoo', review_3_type: 'Travel 12cut',
            pricing_title: 'Start your story',
            pricing_1_name: '12cut × 1', pricing_2_name: 'Same Story × 2', pricing_3_name: 'Two Stories',
            pricing_won: '₩',
            pricing_f_film1: '1 set of 12cut slide film', pricing_f_film2: '2 sets of same 12cut slide film', pricing_f_film3: '2 sets of different 12cut slide film',
            pricing_f_viewer1: '1 vintage viewer', pricing_f_viewer2: '2 vintage viewers', pricing_f_viewer3: '2 vintage viewers',
            pricing_f_box: 'Kraft box packaging',
            pricing_f_per2: '₩50,000 per set',
            faq_title: 'Frequently Asked Questions',
            faq_q1: 'How are photos inserted into the viewer?',
            faq_a1: 'Your 12 selected photos are printed as real film slides. They follow the same 35mm film mount format and can be viewed one by one through the vintage viewer.',
            faq_q2: 'Will the photo quality differ from the original?',
            faq_a2: 'We use a high-resolution printing process to faithfully reproduce the colors and details of the original. Viewed through the lens with light passing through, the colors actually feel more vivid than on a screen.',
            faq_q3: 'Can I add more than 12 photos?',
            faq_a3: 'Each viewer holds 12 slides. The number 12 — like the twelve months of a year or the twelve hours on a clock — is designed to tell one complete story. If you want to capture more moments, simply order an additional set.',
            faq_q4: 'How long does production and shipping take?',
            faq_a4: 'Production takes 3–5 business days after order confirmation, with 1–2 days for shipping. As a made-to-order product, each set is crafted with care.',
            faq_q5: 'Is gift wrapping available?',
            faq_a5: 'Every 12cut ships in a kraft box. You can add a gift message card, and a special gift wrapping option is also available.',
            faq_q6: 'Are my uploaded photos safe?',
            faq_a6: 'Your uploaded photos are automatically deleted from our servers after production. They are never used for any purpose other than production, and are never shared with third parties.',
            footer_tagline: '12 moments from the heart',
            footer_contact: 'Contact', footer_terms: 'Terms', footer_privacy: 'Privacy Policy',
        },
        ko: {
            nav_gallery: '갤러리', nav_product: '제품', nav_how: '이용방법', nav_pricing: '가격',
            cta: '스토리 만들기',
            hero_eyebrow: 'Film Slide Viewer',
            hero_title: `따듯한 빛으로 보는<br>12장의 행복한 기억,<br>${LOGO_SVG}`,
            manifesto_1: '수천 장의 사진 속에서, 정말 소중한 순간은 몇 장이었나요.',
            manifesto_2: '12컷은 그 순간들을 레트로 감성의 뷰어에 담습니다. 빛에 비추면 살아나는 필름 슬라이드, 손에 쥐면 느껴지는 기억의 온기.',
            manifesto_3: '각각의 프레임이 과거와 현재를 잇습니다. 당신만의 타임캡슐, 12컷.',
            examples_title: '12컷에 담긴 이야기들',
            examples_desc: '어떤 순간이든, 12컷으로 담으면 특별해집니다.',
            examples_kw_couple: '연인', examples_kw_family: '가족', examples_kw_pet: '반려동물', examples_kw_travel: '여행', examples_kw_graduation: '졸업', examples_kw_birthday: '생일', examples_kw_daily: '일상', examples_kw_friendship: '우정', examples_kw_anniversary: '기념일', examples_kw_growth: '성장',
            product_section_title: '12컷 뷰어를 만나보세요',
            product_section_desc: '당신의 기억을 담는 가장 오래된 방법 — 한 컷씩, 천천히.',
            product_price: '70,000원', product_buy: '구매하기',
            how_title: '12컷을 만드는 과정',
            how_desc: '세 가지 간단한 단계로, 당신만의 타임캡슐을 완성하세요.',
            how_s1_title: '12장 선택하기', how_s1_desc: '\'슬라이드 섬네일\'을 클릭하시고<br>사진을 선택해 주세요.<br><br>나누고 간직할 이야기들을<br>당신만의 스토리로 만들어 보세요.',
            how_s2_title: '순서 선택하기', how_s2_desc: '슬라이드에 나오는<br>사진의 순서를 정해주세요.<br><br>시간 순이 아니어도 괜찮아요.<br>감정의 흐름으로 연결해 보세요.',
            how_s3_title: '사진 트리밍하기', how_s3_desc: '더 멋진 스토리를 위해서<br>이야기의 한 장면들을<br>완벽하게 트리밍하세요.<br><br>줌과 회전으로 중요한 순간을<br>강조해 보세요.',
            how_result: '완성된 12컷이 빈티지 뷰어에 담겨 찾아갑니다.',
            testimonials_title: '12컷을 만난 사람들',
            review_1_text: '"남자친구 생일에 우리의 1년을 12컷에 담았어요. 뷰어를 눈에 대고 한 컷씩 넘기면서 울더라고요. 디지털 사진첩으론 절대 못 만드는 감동이에요."',
            review_1_name: '지은', review_1_type: '커플 12컷',
            review_2_text: '"아이의 첫 돌까지의 순간들을 담았는데, 필름으로 보니까 진짜 시간여행하는 기분이었어요. 할머니, 할아버지께 선물했더니 매일 보신대요."',
            review_2_name: '민수 아빠', review_2_type: '육아 12컷',
            review_3_text: '"유럽 여행 한 달을 12장으로 압축하니까, 오히려 더 선명하게 기억나요. 책상 위에 뷰어 올려두고 가끔씩 들여다봐요."',
            review_3_name: '현우', review_3_type: '여행 12컷',
            pricing_title: '당신의 이야기를 시작하세요',
            pricing_1_name: '12컷 1세트', pricing_2_name: '같은 이야기 2세트', pricing_3_name: '다른 이야기 2세트',
            pricing_won: '원',
            pricing_f_film1: '12컷 슬라이드 필름 1세트', pricing_f_film2: '같은 12컷 슬라이드 필름 2세트', pricing_f_film3: '다른 12컷 슬라이드 필름 2세트',
            pricing_f_viewer1: '빈티지 뷰어 1개', pricing_f_viewer2: '빈티지 뷰어 2개', pricing_f_viewer3: '빈티지 뷰어 2개',
            pricing_f_box: '크래프트 박스 포장',
            pricing_f_per2: '1세트당 50,000원',
            faq_title: '자주 묻는 질문',
            faq_q1: '사진은 어떤 형태로 들어가나요?', faq_a1: '선택하신 12장의 사진이 실제 필름 슬라이드 형태로 인쇄됩니다. 35mm 필름 마운트와 동일한 규격으로, 빈티지 뷰어에 넣어 한 컷씩 감상할 수 있습니다.',
            faq_q2: '사진 품질이 원본과 다르지 않나요?', faq_a2: '고해상도 인쇄 공정을 통해 원본의 색감과 디테일을 최대한 재현합니다. 뷰어의 렌즈를 통해 보면 빛이 투과되면서 오히려 화면보다 더 생생한 색감을 느끼실 수 있습니다.',
            faq_q3: '12장 외에 추가할 수 있나요?', faq_a3: '하나의 뷰어에는 12장의 슬라이드가 들어갑니다. 12라는 숫자는 일 년의 열두 달, 시계의 열두 시간처럼 하나의 완결된 이야기를 담기 위한 구성입니다. 더 많은 순간을 담고 싶다면 추가 세트를 주문해 주세요.',
            faq_q4: '제작 및 배송은 얼마나 걸리나요?', faq_a4: '주문 확정 후 제작에 3~5 영업일, 배송에 1~2 영업일이 소요됩니다. 주문 제작 상품이므로 정성스럽게 한 세트씩 제작됩니다.',
            faq_q5: '선물 포장이 되나요?', faq_a5: '모든 12컷은 크래프트 박스에 담겨 배송됩니다. 선물용 메시지 카드를 추가하실 수 있으며, 별도의 선물 포장 옵션도 준비되어 있습니다.',
            faq_q6: '업로드한 사진은 안전한가요?', faq_a6: '업로드하신 사진은 제작 완료 후 서버에서 자동 삭제됩니다. 제작 목적 외에는 절대 사용되지 않으며, 제3자에게 공유되지 않습니다.',
            footer_tagline: '마음을 담는 12번의 순간',
            footer_contact: '문의하기', footer_terms: '이용약관', footer_privacy: '개인정보처리방침',
        },
        ja: {
            nav_gallery: 'ギャラリー', nav_product: '製品', nav_how: '使い方', nav_pricing: '料金',
            cta: 'ストーリーをつくる',
            hero_eyebrow: 'Film Slide Viewer',
            hero_title: `温かな光で見つめる<br>12枚の幸せな記憶、<br>${LOGO_SVG}`,
            manifesto_1: '何千枚もの写真の中で、本当に大切な瞬間は何枚ありましたか。',
            manifesto_2: '12cutはその瞬間をレトロなビューワーに収めます。光に透かすと蘇るフィルムスライド、手に取ると感じる記憶の温もり。',
            manifesto_3: 'それぞれのフレームが過去と現在をつなぎます。あなただけのタイムカプセル、12cut。',
            examples_title: '12カットに刻まれた物語', examples_desc: 'どんな瞬間も、12カットに収めると特別になります。',
            examples_kw_couple: '恋人', examples_kw_family: '家族', examples_kw_pet: 'ペット', examples_kw_travel: '旅行', examples_kw_graduation: '卒業', examples_kw_birthday: '誕生日', examples_kw_daily: '日常', examples_kw_friendship: '友情', examples_kw_anniversary: '記念日', examples_kw_growth: '成長',
            product_section_title: '12cutビューワーをご紹介',
            product_section_desc: '記憶を手に取る、もっとも古くからの方法——一カットずつ、ゆっくりと。',
            product_price: '¥7,000', product_buy: '購入する',
            how_title: '12カットのつくり方', how_desc: '3つの簡単なステップで、あなただけのタイムカプセルを完成させましょう。',
            how_s1_title: '12枚を選ぶ', how_s1_desc: '選択ボタンをクリックして<br>12枚の写真を選んでください。<br>ドラッグ＆ドロップまたは<br>ギャラリーから選択できます。',
            how_s2_title: '順番を決める', how_s2_desc: 'スライドに表示される<br>写真の順番を決めてください。<br>丸をタップすると<br>番号が付きます。',
            how_s3_title: 'トリミング＆調整', how_s3_desc: '各カットにあなたらしさを加えましょう。<br>ズームで大切な瞬間を強調。<br>回転で感性をプラス。',
            how_result: '完成した12カットがヴィンテージビューワーに入ってお届けされます。',
            testimonials_title: '12cutに出会った人々',
            review_1_text: '"彼氏の誕生日に私たちの1年を12カットに収めました。ビューワーを覗いて一枚ずつめくりながら泣いていました。デジタルアルバムでは絶対に作れない感動です。"',
            review_1_name: 'ジウン', review_1_type: 'カップル12cut',
            review_2_text: '"赤ちゃんの1歳までの瞬間を収めたら、フィルムで見ると本当にタイムトラベルしている気分でした。祖父母にプレゼントしたら毎日見ているそうです。"',
            review_2_name: 'ミンスのパパ', review_2_type: '育児12cut',
            review_3_text: '"ヨーロッパ旅行1ヶ月を12枚に凝縮したら、かえってもっと鮮明に思い出せます。デスクにビューワーを置いて、時々覗いています。"',
            review_3_name: 'ヒョヌ', review_3_type: '旅行12cut',
            pricing_title: 'あなたの物語を始めましょう',
            pricing_1_name: '12cut × 1', pricing_2_name: '同じストーリー × 2', pricing_3_name: '2つのストーリー',
            pricing_won: '¥',
            pricing_f_film1: '12cutスライドフィルム1セット', pricing_f_film2: '同じ12cutスライドフィルム2セット', pricing_f_film3: '異なる12cutスライドフィルム2セット',
            pricing_f_viewer1: 'ヴィンテージビューワー1個', pricing_f_viewer2: 'ヴィンテージビューワー2個', pricing_f_viewer3: 'ヴィンテージビューワー2個',
            pricing_f_box: 'クラフトボックス梱包',
            pricing_f_per2: '1セットあたり¥5,000',
            faq_title: 'よくある質問',
            faq_q1: '写真はどのような形で入りますか？', faq_a1: '選んだ12枚の写真が実際のフィルムスライドとして印刷されます。35mmフィルムマウントと同じ規格で、ヴィンテージビューワーに入れて一枚ずつ鑑賞できます。',
            faq_q2: '写真の品質は原本と異なりますか？', faq_a2: '高解像度の印刷工程で原本の色味とディテールを最大限に再現します。レンズを通して光が透過すると、画面よりもむしろ鮮やかな色合いを感じていただけます。',
            faq_q3: '12枚以上追加できますか？', faq_a3: '1つのビューワーには12枚のスライドが入ります。12という数字は、1年の12ヶ月、時計の12時間のように、1つの完結した物語を収めるための構成です。もっと多くの瞬間を収めたい場合は、追加セットをご注文ください。',
            faq_q4: '制作・配送にはどのくらいかかりますか？', faq_a4: '注文確定後、制作に3〜5営業日、配送に1〜2営業日かかります。受注生産品のため、1セットずつ丁寧に制作されます。',
            faq_q5: 'ギフトラッピングはできますか？', faq_a5: 'すべての12cutはクラフトボックスに入れてお届けします。ギフト用メッセージカードを追加でき、特別なギフトラッピングオプションもご用意しています。',
            faq_q6: 'アップロードした写真は安全ですか？', faq_a6: 'アップロードされた写真は制作完了後、サーバーから自動的に削除されます。制作目的以外には一切使用されず、第三者に共有されることもありません。',
            footer_tagline: '心を込めた12の瞬間',
            footer_contact: 'お問い合わせ', footer_terms: '利用規約', footer_privacy: 'プライバシーポリシー',
        },
        zh: {
            nav_gallery: '画廊', nav_product: '产品', nav_how: '使用方法', nav_pricing: '价格',
            cta: '创建你的故事',
            hero_eyebrow: 'Film Slide Viewer',
            hero_title: `温暖光影中珍藏的<br>12张幸福记忆，<br>${LOGO_SVG}`,
            manifesto_1: '数千张照片中，真正珍贵的瞬间有几张？',
            manifesto_2: '12cut将那些瞬间收藏在复古感的观片器中。透过光线鲜活起来的胶片幻灯片，握在手中便能感受到记忆的温度。',
            manifesto_3: '每一帧都连接着过去与现在。属于你的时间胶囊，12cut。',
            examples_title: '12格中的故事', examples_desc: '任何瞬间，用12格记录都变得特别。',
            examples_kw_couple: '情侣', examples_kw_family: '家庭', examples_kw_pet: '宠物', examples_kw_travel: '旅行', examples_kw_graduation: '毕业', examples_kw_birthday: '生日', examples_kw_daily: '日常', examples_kw_friendship: '友情', examples_kw_anniversary: '纪念日', examples_kw_growth: '成长',
            product_section_title: '认识12cut观片器',
            product_section_desc: '珍藏记忆最古老的方式——一帧一帧，慢慢感受。',
            product_price: '¥350', product_buy: '立即购买',
            how_title: '如何制作你的12格', how_desc: '三个简单步骤，完成属于你的时间胶囊。',
            how_s1_title: '选择12张照片', how_s1_desc: '点击选择按钮<br>选择你的12张照片。<br>拖拽上传或从<br>相册中选择。',
            how_s2_title: '排列顺序', how_s2_desc: '设定幻灯片中<br>照片的显示顺序。<br>点击圆圈<br>分配编号。',
            how_s3_title: '裁剪与调整', how_s3_desc: '为每一格添加你的个人风格。<br>缩放突出重要瞬间。<br>旋转增添感性。',
            how_result: '完成的12格将装在复古观片器中送达。',
            testimonials_title: '遇见12cut的人们',
            review_1_text: '"男朋友生日时，我把我们一年的回忆装进了12格。他拿着观片器一帧一帧地看，哭了。数码相册永远无法创造这种感动。"',
            review_1_name: '智恩', review_1_type: '情侣12cut',
            review_2_text: '"记录了宝宝第一年的瞬间，用胶片看真的像时间旅行。送给爷爷奶奶后，他们每天都在看。"',
            review_2_name: '民秀爸爸', review_2_type: '育儿12cut',
            review_3_text: '"把一个月的欧洲旅行压缩成12张，反而记忆更清晰了。观片器放在桌上，偶尔拿起来看看。"',
            review_3_name: '贤宇', review_3_type: '旅行12cut',
            pricing_title: '开始你的故事',
            pricing_1_name: '12cut × 1', pricing_2_name: '相同故事 × 2', pricing_3_name: '两个故事',
            pricing_won: '¥',
            pricing_f_film1: '12cut幻灯片胶卷1套', pricing_f_film2: '相同12cut幻灯片胶卷2套', pricing_f_film3: '不同12cut幻灯片胶卷2套',
            pricing_f_viewer1: '复古观片器1个', pricing_f_viewer2: '复古观片器2个', pricing_f_viewer3: '复古观片器2个',
            pricing_f_box: '牛皮纸盒包装',
            pricing_f_per2: '每套¥175',
            faq_title: '常见问题',
            faq_q1: '照片是以什么形式放入的？', faq_a1: '你选择的12张照片将被印刷为真正的胶片幻灯片。采用与35mm胶片安装座相同的规格，可以放入复古观片器中逐帧欣赏。',
            faq_q2: '照片质量会与原图不同吗？', faq_a2: '我们使用高分辨率印刷工艺，最大程度还原原图的色彩和细节。通过镜头观看时，光线透过胶片，色彩甚至比屏幕上更加生动。',
            faq_q3: '可以超过12张吗？', faq_a3: '每个观片器可放入12张幻灯片。12这个数字——如同一年的十二个月、时钟的十二个小时——旨在讲述一个完整的故事。如果想记录更多瞬间，可以订购额外套装。',
            faq_q4: '制作和配送需要多长时间？', faq_a4: '订单确认后，制作需3-5个工作日，配送需1-2个工作日。作为定制产品，每套都精心制作。',
            faq_q5: '可以礼品包装吗？', faq_a5: '所有12cut均以牛皮纸盒包装配送。可以添加礼品留言卡，还提供特别的礼品包装选项。',
            faq_q6: '上传的照片安全吗？', faq_a6: '上传的照片在制作完成后会自动从服务器删除。除制作目的外绝不使用，也不会与第三方共享。',
            footer_tagline: '用心珍藏的12个瞬间',
            footer_contact: '联系我们', footer_terms: '使用条款', footer_privacy: '隐私政策',
        },
    };

    let currentLang = 'en';

    // ===== SHOPIFY STOREFRONT API =====
    const SHOPIFY_STORE = '12cut-2.myshopify.com';
    const SHOPIFY_STOREFRONT_TOKEN = '1fbcf067bf726bfac94a51637c195326';
    const SHOPIFY_API_VERSION = '2025-01';

    const SHOPIFY_VARIANTS = {
        single: 'gid://shopify/ProductVariant/44139069407268',
        same2:  'gid://shopify/ProductVariant/44139071471652',
        mix2:   'gid://shopify/ProductVariant/44139073765412',
    };

    const DEFAULT_EDITOR_URL = 'https://www.donutframe.com/12cut_editor/index.html';
    const DEFAULT_FLOW_MODE = 'editor-first';
    const runtimeCommerceConfig = window.__TWELVECUT_COMMERCE__ || {};
    const pageQuery = new URLSearchParams(window.location.search);
    const getQueryValue = (key) => (pageQuery.get(key) || '').trim();
    const getRuntimeValue = (key) => {
        const value = runtimeCommerceConfig[key];
        return typeof value === 'string' ? value.trim() : '';
    };
    const commerceConfig = {
        editorUrl: getRuntimeValue('editorUrl') || getQueryValue('editor_url') || DEFAULT_EDITOR_URL,
        flowMode: getRuntimeValue('flowMode') || getQueryValue('flow_mode') || DEFAULT_FLOW_MODE,
    };

    const shopifyFetch = async (query, variables = {}) => {
        const endpoint = `https://${SHOPIFY_STORE}/api/${SHOPIFY_API_VERSION}/graphql.json`;
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
                },
                body: JSON.stringify({ query, variables }),
            });
            const json = await res.json();
            if (json.errors) {
                console.error('Shopify API error:', json.errors);
                return null;
            }
            return json.data;
        } catch (error) {
            console.error('Shopify fetch failed:', error);
            return null;
        }
    };

    const createShopifyCheckout = async (plan) => {
        const variantId = SHOPIFY_VARIANTS[plan];
        if (!variantId) {
            console.error('Unknown plan:', plan);
            return null;
        }

        const quantity = 1;
        const mutation = `
            mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                    cart {
                        id
                        checkoutUrl
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;
        const variables = {
            input: {
                lines: [{ merchandiseId: variantId, quantity }],
            },
        };

        const data = await shopifyFetch(mutation, variables);
        if (!data || !data.cartCreate || data.cartCreate.userErrors.length > 0) {
            console.error('Cart creation failed:', data?.cartCreate?.userErrors);
            return null;
        }
        return data.cartCreate.cart.checkoutUrl;
    };

    const handleCheckoutRedirect = async () => {
        const action = pageQuery.get('action');
        const plan = pageQuery.get('plan');
        if (action !== 'checkout' || !plan) return;

        document.body.style.cursor = 'wait';
        const checkoutUrl = await createShopifyCheckout(plan);
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        } else {
            document.body.style.cursor = '';
            alert('체크아웃 생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    handleCheckoutRedirect();

    const getCheckoutReturnUrl = (plan) => {
        const base = window.location.origin + window.location.pathname;
        return `${base}?action=checkout&plan=${encodeURIComponent(plan)}`;
    };

    function buildEditorLink(plan) {
        const selectedPlan = plan || 'single';
        const cartUrl = getCheckoutReturnUrl(selectedPlan);
        try {
            const url = new URL(commerceConfig.editorUrl);
            url.searchParams.set('plan', selectedPlan);
            url.searchParams.set('lang', currentLang);
            url.searchParams.set('cart_url', cartUrl);
            url.searchParams.set('flow_mode', commerceConfig.flowMode);
            url.searchParams.set('return_url', window.location.href);
            return url.toString();
        } catch (error) {
            console.error('Invalid editor URL config:', error);
            return `${DEFAULT_EDITOR_URL}?plan=${encodeURIComponent(selectedPlan)}&lang=${encodeURIComponent(currentLang)}&flow_mode=${encodeURIComponent(DEFAULT_FLOW_MODE)}`;
        }
    }

    const NEXT_APP_URL = 'https://12cut-dev.pages.dev';

    const pricingCards = document.querySelectorAll('.js-pricing-card');
    const pricingCta = document.querySelector('.js-pricing-cta');

    const handleCardSelect = (selectedCard) => {
        pricingCards.forEach((card) => {
            card.classList.remove('pricing-card--selected');
            card.setAttribute('aria-checked', 'false');
        });
        selectedCard.classList.add('pricing-card--selected');
        selectedCard.setAttribute('aria-checked', 'true');
        if (pricingCta) {
            pricingCta.dataset.plan = selectedCard.dataset.plan;
        }
    };

    pricingCards.forEach((card) => {
        card.addEventListener('click', () => handleCardSelect(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardSelect(card);
            }
        });
    });



    const loadedFonts = new Set();
    const loadLangFont = (lang) => {
        if (loadedFonts.has(lang)) return;
        loadedFonts.add(lang);
        const fontUrls = {
            ja: 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700;900&display=swap',
            zh: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap',
        };
        const url = fontUrls[lang];
        if (!url) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    };

    const applyLang = (lang) => {
        currentLang = lang;
        const dict = translations[lang];
        if (!dict) return;

        loadLangFont(lang);
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('lang-btn--active', btn.dataset.lang === lang);
        });

    };

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });

    // ===== NAV SCROLL EFFECT =====
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== SCROLL REVEAL (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.how__card, .how__result, .testimonial-card, .pricing-card, .product__header, .product__card, .examples__header, .how__header, .testimonials__header, .pricing__header, .faq__media, .faq__content');

    const manifestoTexts = document.querySelectorAll('.manifesto__heart, .manifesto__text');
    const manifestoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.children;
                const idx = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 200);
                manifestoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    manifestoTexts.forEach(el => manifestoObserver.observe(el));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const siblings = entry.target.parentElement.children;
                const siblingIndex = Array.from(siblings).indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 100);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // Make visible class work
    const style = document.createElement('style');
    style.textContent = `
    .how__card.visible, .how__result.visible, .testimonial-card.visible, .pricing-card.visible,
    .product__header.visible, .product__card.visible,
    .examples__header.visible, .how__header.visible,
    .testimonials__header.visible, .manifesto__text.visible,
    .pricing__header.visible,
    .faq__media.visible, .faq__content.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
    document.head.appendChild(style);

    // ===== FILM REEL + LENS SYNC =====
    const lensImg = document.querySelector('.film-reel__lens-img');
    const reelSlots = document.querySelectorAll('.film-reel__slot img');
    const reelRing = document.querySelector('.film-reel__ring');

    if (lensImg && reelSlots.length === 12) {
        const slideSrcs = Array.from(reelSlots).map(img => img.src);
        let stepCount = 0;
        let reelInterval = null;

        const STEP_DURATION = 2000;

        const stepForward = () => {
            stepCount++;
            const deg = stepCount * 30;
            const topSlot = (12 - (stepCount % 12)) % 12;

            reelRing.style.transform = `rotate(${deg}deg)`;
            lensImg.classList.add('is-fading');

            setTimeout(() => {
                lensImg.src = slideSrcs[topSlot];
                lensImg.classList.remove('is-fading');
            }, 300);
        };

        const startReel = () => {
            if (reelInterval) return;
            reelInterval = setInterval(stepForward, STEP_DURATION);
        };

        const stopReel = () => {
            clearInterval(reelInterval);
            reelInterval = null;
        };

        startReel();

        const filmReel = document.querySelector('.film-reel');
        if (filmReel) {
            filmReel.addEventListener('mouseenter', () => {
                isPaused = true;
                stopReel();
            });
            filmReel.addEventListener('mouseleave', () => {
                isPaused = false;
                startReel();
            });
        }
    }

    // ===== PARALLAX HERO IMAGE =====
    const heroImage = document.querySelector('.hero__image-wrapper');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `rotate(-5deg) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

    // ===== COUNTER ANIMATION FOR PRICING =====
    const priceElements = document.querySelectorAll('.pricing-card__amount');
    const priceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace(/,/g, ''));
                animateCount(entry.target, 0, target, 1200);
                priceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    priceElements.forEach(el => priceObserver.observe(el));

    function animateCount(el, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);

            el.textContent = current.toLocaleString('ko-KR');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const summary = item.querySelector('.faq__question');

        summary.addEventListener('click', (e) => {
            e.preventDefault();

            const isOpen = item.hasAttribute('open');

            faqItems.forEach(other => {
                if (other !== item && other.hasAttribute('open')) {
                    other.removeAttribute('open');
                }
            });

            if (isOpen) {
                item.removeAttribute('open');
            } else {
                item.setAttribute('open', '');
            }
        });

        summary.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                summary.click();
            }
        });
    });

    // ===== PRODUCT IMAGE VIEWER =====

    const colorMap = [
        { label: 'white', ko: '화이트', file: '12CUT VARIATION.3987.webp' },
        { label: 'cream', ko: '크림', file: '12CUT VARIATION.3988.webp' },
        { label: 'light blue', ko: '라이트 블루', file: '12CUT VARIATION.3989.webp' },
        { label: 'green', ko: '그린', file: '12CUT VARIATION.3991.webp' },
        { label: 'red', ko: '레드', file: '12CUT VARIATION.3990.webp' },
        { label: 'dark gray', ko: '다크 그레이', file: '12CUT VARIATION.3992.webp' },
    ];

    // ===== PRODUCT COLOR SELECTOR =====
    const colorBtns = document.querySelectorAll('.product__color');
    const productName = document.querySelector('.product__name');
    const renderImg = document.getElementById('product-render');

    // 흰색 기본 이미지의 src에서 에셋 디렉터리를 추출한다.
    // pages.dev(상대경로)와 고도몰 스킨(pages.dev 절대경로) 양쪽에서 동일하게 동작시키기 위함.
    const initialSrc = renderImg ? renderImg.getAttribute('src') || '' : '';
    const assetBase = initialSrc.replace(/[^/]*$/, '');

    colorBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('product__color--active'));
            btn.classList.add('product__color--active');

            const color = colorMap[i];
            if (productName && color) {
                productName.textContent = `12cut ${color.label}`;
            }

            if (renderImg && color) {
                renderImg.style.opacity = '0';
                setTimeout(() => {
                    renderImg.src = assetBase + color.file;
                    renderImg.alt = `12cut ${color.label}`;
                    renderImg.style.opacity = '1';
                }, 150);
            }
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // ===== MAGNETIC HOVER FOR CTA BUTTONS =====
    const ctaButtons = document.querySelectorAll('.hero__cta, .nav__cta');

    ctaButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });


});
