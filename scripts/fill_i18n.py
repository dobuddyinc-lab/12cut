#!/usr/bin/env python3
"""12cut 단독 i18n 채움 스크립트.

- 대상: /dobuddy/files/{en,zh}.html (12cut 오리진 소유, bd2와 격리)
- 정책: Class A(기능성/시스템 UI)만 채움. Class B(BD2 IP 고유명)·손상행은 건드리지 않음.
- 안전: 빈 값(empty)만 채우고 기존 값은 절대 덮어쓰지 않음. $, <strong>, <br>, <span> 토큰 보존.
"""
import json
import os

BASE = os.path.join(os.path.dirname(__file__), "i18n_base")
OUT = os.path.join(os.path.dirname(__file__), "i18n_out")

# Class B (BD2 캐릭터·스킨 고유명) + 손상행: 절대 채우지 않음
SKIP = {
    "프로즌퀸", "워터파크의 여왕", "스트레인저 바니", "이노센트 바니", "티르",
    "쉐도우 바니", "에레니르", "비터스윗 바니", "다리안", "타락한 날개", "올리비에",
    '"',  # 손상행(따옴표 키)
}

# Class A 번역맵: 한국어 원문 -> {en, zh}. 빈 슬롯에만 적용.
T = {
    "택배 배송": {"en": "Parcel Delivery", "zh": "快递配送"},
    "결제 완료일 기준 영업일 2~3일 이내 출고": {"en": "Ships within 2–3 business days from the payment completion date", "zh": "以付款完成日为准，2~3个工作日内发货"},
    "옵션을 선택하세요.": {"en": "Please select an option.", "zh": "请选择选项。"},
    "<strong>상품이 장바구니에 담겼습니다.</strong><br>바로 확인하시겠습니까?": {"en": "<strong>The item has been added to your cart.</strong><br>Would you like to view it now?", "zh": "<strong>商品已加入购物车。</strong><br>是否立即查看？"},
    "약관동의": {"en": "Agree to Terms", "zh": "同意条款"},
    "정보입력": {"en": "Enter Information", "zh": "填写信息"},
    "가입완료": {"en": "Registration Complete", "zh": "注册完成"},
    "브라운더스트2 굿즈의 모든 약관을 확인하고 전체 동의합니다.": {"en": "I have reviewed and agree to all terms of Brown Dust 2 Goods.", "zh": "我已确认并同意 Brown Dust 2 Goods 的所有条款。"},
    "전체동의, 선택항목도 포함됩니다.": {"en": "Agree to all, including optional items.", "zh": "全部同意，包含可选项目。"},
    "(필수)": {"en": "(Required)", "zh": "(必填)"},
    "이용약관": {"en": "Terms of Use", "zh": "使用条款"},
    "전체보기": {"en": "View All", "zh": "查看全部"},
    "개인정보 수집 및 이용": {"en": "Collection and Use of Personal Information", "zh": "个人信息的收集与使用"},
    "이용약관과 개인정보 수집 및 이용에 대한 안내 모두 동의해주세요.": {"en": "Please agree to both the Terms of Use and the notice on the collection and use of personal information.", "zh": "请同意使用条款以及个人信息收集与使用须知。"},
    "이전단계": {"en": "Previous", "zh": "上一步"},
    "다음단계": {"en": "Next", "zh": "下一步"},
    "구글 아이디로 가입하기": {"en": "Sign up with Google", "zh": "使用 Google 账号注册"},
    "네이버로 가입하기": {"en": "Sign up with Naver", "zh": "使用 Naver 注册"},
    "Facebook으로 가입하기": {"en": "Sign up with Facebook", "zh": "使用 Facebook 注册"},
    "카카오로 가입하기": {"en": "Sign up with Kakao", "zh": "使用 Kakao 注册"},
    "브라운더스트 아이디로 가입하기": {"en": "Sign up with Brown Dust ID", "zh": "使用 Brown Dust ID 注册"},
    "이미 쇼핑몰 회원이세요?": {"en": "Already a member?", "zh": "已经是会员了吗？"},
    "비밀번호가 정상적으로 변경되었습니다.": {"en": "Your password has been changed successfully.", "zh": "密码已成功修改。"},
    "비밀번호 변경": {"en": "Change Password", "zh": "修改密码"},
    "새로운 비밀번호를 등록해 주세요.": {"en": "Please register a new password.", "zh": "请设置新密码。"},
    "새 비밀번호 확인": {"en": "Confirm New Password", "zh": "确认新密码"},
    "영문대/소문자, 숫자, 특수문자 중 2가지 이상 조합하세요": {"en": "Combine at least two of: uppercase/lowercase letters, numbers, and special characters", "zh": "请组合大写/小写字母、数字、特殊字符中的两种以上"},
    "비밀번호 찾기": {"en": "Find Password", "zh": "找回密码"},
    "휴면회원 해제 후 비밀번호 찾기가 가능합니다.": {"en": "You can find your password after reactivating your dormant account.", "zh": "解除休眠会员后方可找回密码。"},
    "휴면회원으로 전환된 아이디입니다.\xa0휴면회원 해제 후 비밀번호 찾기가 가능하오니, 고객센터로 문의해주세요.": {"en": "This ID has been switched to a dormant account. You can find your password after reactivating it, so please contact customer service.", "zh": "该账号已转为休眠会员。解除休眠会员后方可找回密码，请联系客服中心。"},
    "회원정보를 찾을 수 없습니다.": {"en": "Member information could not be found.", "zh": "找不到会员信息。"},
    "아이디 입력": {"en": "Enter ID", "zh": "输入账号"},
    "비밀번호를 찾고자 하는 아이디를 입력해 주세요.": {"en": "Please enter the ID for which you want to find the password.", "zh": "请输入要找回密码的账号。"},
    "아이디를 모르시나요?": {"en": "Forgot your ID?", "zh": "忘记账号了吗？"},
    "다음": {"en": "Next", "zh": "下一步"},
    "휴대폰 번호를 입력해주세요.": {"en": "Please enter your mobile number.", "zh": "请输入手机号码。"},
    "메일 형식이 틀렸습니다.": {"en": "The email format is invalid.", "zh": "邮箱格式不正确。"},
    "이메일을 입력해주세요.": {"en": "Please enter your email.", "zh": "请输入电子邮箱。"},
    "아이디찾기": {"en": "Find ID", "zh": "找回账号"},
    "휴대폰번호": {"en": "Mobile Number", "zh": "手机号码"},
    "이름": {"en": "Name", "zh": "姓名"},
    "가입휴대폰번호": {"en": "Registered Mobile Number", "zh": "注册手机号码"},
    "가입메일주소": {"en": "Registered Email Address", "zh": "注册邮箱地址"},
    "직접입력": {"en": "Enter Directly", "zh": "直接输入"},
    "이름을 입력해주세요.": {"en": "Please enter your name.", "zh": "请输入姓名。"},
    "로그인하기": {"en": "Log In", "zh": "登录"},
    "SNS 계정으로 로그인": {"en": "Log in with SNS account", "zh": "使用社交账号登录"},
    "아이디": {"en": "ID", "zh": "账号"},
    "비밀번호": {"en": "Password", "zh": "密码"},
    "아이디 저장": {"en": "Remember ID", "zh": "记住账号"},
    "회원가입": {"en": "Sign Up", "zh": "注册"},
    "아이디 찾기": {"en": "Find ID", "zh": "找回账号"},
    "로그인": {"en": "Log In", "zh": "登录"},
    "아이디를 입력해주세요": {"en": "Please enter your ID", "zh": "请输入账号"},
    "이름을 입력해주세요": {"en": "Please enter your name", "zh": "请输入姓名"},
    "메일이 발송되었습니다.": {"en": "The email has been sent.", "zh": "邮件已发送。"},
    "남은 인증시간": {"en": "Time remaining", "zh": "剩余验证时间"},
    "인증번호를 입력해주세요.": {"en": "Please enter the verification code.", "zh": "请输入验证码。"},
    "을 체크해주세요.": {"en": " — please check this item.", "zh": " — 请勾选此项。"},
    "삭제": {"en": "Delete", "zh": "删除"},
    "삭제 하시겠습니까?": {"en": "Are you sure you want to delete?", "zh": "确定要删除吗？"},
    "리뷰 작성하기": {"en": "Write a Review", "zh": "撰写评价"},
    "등록": {"en": "Submit", "zh": "提交"},
    "상품은 만족하셨나요?": {"en": "Were you satisfied with the product?", "zh": "您对商品满意吗？"},
    "상품평을 작성해주세요.": {"en": "Please write a product review.", "zh": "请撰写商品评价。"},
    "회원가입이 <strong>완료</strong> 되었습니다.": {"en": "Your membership registration has been <strong>completed</strong>.", "zh": "会员注册已<strong>完成</strong>。"},
    "주문하시는 분 정보를 입력해 주세요.": {"en": "Please enter the orderer's information.", "zh": "请输入订购人信息。"},
    "주문하시는 분 휴대폰 번호 정보를 입력해 주세요.": {"en": "Please enter the orderer's mobile number.", "zh": "请输入订购人手机号码。"},
    "주문하시는 분 이메일 정보를 입력해 주세요.": {"en": "Please enter the orderer's email.", "zh": "请输入订购人电子邮箱。"},
    "받으실 분 정보를 입력해 주세요.": {"en": "Please enter the recipient's information.", "zh": "请输入收件人信息。"},
    "받으실 분 휴대폰 번호 정보를 입력해 주세요.": {"en": "Please enter the recipient's mobile number.", "zh": "请输入收件人手机号码。"},
    "받으실 곳 우편번호 정보를 입력해 주세요.": {"en": "Please enter the recipient's postal code.", "zh": "请输入收件地址的邮政编码。"},
    "받으실 곳 주소 정보를 입력해 주세요.": {"en": "Please enter the recipient's address.", "zh": "请输入收件地址。"},
    "청약의사 재확인을 동의해 주셔야 주문을 진행하실 수 있습니다.": {"en": "You must agree to reconfirm your purchase intent to proceed with the order.", "zh": "您需同意再次确认购买意向后方可继续下单。"},
    "선택하신 $개상품을 장바구니에서 삭제 하시겠습니까?": {"en": "Remove the selected $ item(s) from your cart?", "zh": "确定要从购物车中删除所选的 $ 件商品吗？"},
    "선택하신 $개상품만 주문합니다.": {"en": "Order only the selected $ item(s).", "zh": "仅订购所选的 $ 件商品。"},
    "(필수) 개인정보 수집 및 이용 을 체크해주세요.": {"en": "(Required) Please check the consent for the collection and use of personal information.", "zh": "(必填) 请勾选个人信息收集与使用。"},
    "(필수) 이용약관을 체크해주세요.": {"en": "(Required) Please check the Terms of Use.", "zh": "(必填) 请勾选使用条款。"},
    "정보/이벤트 메일 수신에 동의합니다.": {"en": "I agree to receive information/event emails.", "zh": "我同意接收资讯/活动邮件。"},
    "정보/이벤트 SMS 수신에 동의합니다.": {"en": "I agree to receive information/event SMS.", "zh": "我同意接收资讯/活动短信。"},
    "패스워드를 입력해주세요": {"en": "Please enter your password", "zh": "请输入密码"},
    "비밀번호가 일치하지 않습니다.": {"en": "Passwords do not match.", "zh": "密码不一致。"},
    "회원정보 변경": {"en": "Edit Member Information", "zh": "修改会员信息"},
    "회원님의 정보를 안전하게 보호하기 위해 계정을 <span class=\"c-red\">재인증</span> 해주세요.": {"en": "To keep your information secure, please <span class=\"c-red\">re-verify</span> your account.", "zh": "为保护您的信息安全，请<span class=\"c-red\">重新认证</span>您的账号。"},
    "인증하기": {"en": "Verify", "zh": "认证"},
    "비밀번호 설정": {"en": "Set Password", "zh": "设置密码"},
    "생일": {"en": "Birthday", "zh": "生日"},
    "완료": {"en": "Done", "zh": "完成"},
    "현재 비밀번호": {"en": "Current Password", "zh": "当前密码"},
    "새 비밀번호": {"en": "New Password", "zh": "新密码"},
    "비밀번호 확인": {"en": "Confirm Password", "zh": "确认密码"},
    "영문소문자/숫자, 4~16자": {"en": "Lowercase letters/numbers, 4–16 characters", "zh": "小写字母/数字，4~16位"},
    "영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자": {"en": "Combine at least two of uppercase/lowercase letters, numbers, special characters; 10–16 characters", "zh": "大小写字母/数字/特殊字符中两种以上组合，10~16位"},
    "가격 정보가 없거나 옵션이 선택되지 않았습니다!": {"en": "Price information is missing or no option has been selected!", "zh": "缺少价格信息或未选择选项！"},
    "로그인하셔야 본 서비스를 이용하실 수 있습니다.": {"en": "You must log in to use this service.", "zh": "您需登录后才能使用本服务。"},
    "예약 판매": {"en": "Pre-order", "zh": "预售"},
}


# $t()로 감쌌으나 사전에 키 자체가 없던 문구 → 신규 키로 추가(en/ja/zh).
# (global.js / custom.js의 $t('...') 리터럴과 정확히 일치해야 함. 마침표 유무까지)
NEW_KEYS = {
    "스토리 만들기": {"en": "Make Your Story", "ja": "ストーリーをつくる", "zh": "创建你的故事"},
    "반품/교환정보": {"en": "Returns / Exchanges", "ja": "返品/交換情報", "zh": "退换货信息"},
    "옵션을 선택하세요": {"en": "Please select an option", "ja": "オプションを選択してください", "zh": "请选择选项"},
    "마일리지 사용": {"en": "Use Mileage", "ja": "マイレージ使用", "zh": "使用里程"},
    "작성한 리뷰가 없습니다.": {"en": "No reviews written yet.", "ja": "作成したレビューがありません。", "zh": "暂无撰写的评价。"},
    "사용자 편집상품": {"en": "Custom-edited Product", "ja": "ユーザー編集商品", "zh": "用户编辑商品"},
    "추가정보": {"en": "Additional Info", "ja": "追加情報", "zh": "附加信息"},
    "Q & A ": {"en": "Q & A ", "ja": "Q & A ", "zh": "Q & A "},
    "주문취소": {"en": "Cancel Order", "ja": "注文キャンセル", "zh": "取消订单"},
    "주문 취소": {"en": "Cancel Order", "ja": "注文キャンセル", "zh": "取消订单"},
    "$와 $님께": {"en": "To $ and $", "ja": "$と$様へ", "zh": "致 $ 与 $"},
    "찜한 상품이 없습니다.": {"en": "No wishlisted items.", "ja": "お気に入り商品がありません。", "zh": "暂无收藏商品。"},
    "회원정보 수정": {"en": "Edit Member Information", "ja": "会員情報修正", "zh": "修改会员信息"},
    "회원 탈퇴": {"en": "Delete Account", "ja": "退会", "zh": "注销会员"},
    "회원탈퇴": {"en": "Delete Account", "ja": "退会", "zh": "注销会员"},
    "탈퇴": {"en": "Delete", "ja": "退会", "zh": "注销"},
    "탈퇴하기": {"en": "Delete Account", "ja": "退会する", "zh": "注销会员"},
    "회원탈퇴 신청": {"en": "Request Account Deletion", "ja": "退会申請", "zh": "申请注销会员"},
    "회원탈퇴 안내": {"en": "Account Deletion Notice", "ja": "退会のご案内", "zh": "注销会员须知"},
    "회원탈퇴 사유": {"en": "Reason for Account Deletion", "ja": "退会理由", "zh": "注销原因"},
    "회원 탈퇴를 하시겠습니까?": {"en": "Are you sure you want to delete your account?", "ja": "退会しますか？", "zh": "确定要注销会员吗？"},
    "회원탈퇴를 하시겠습니까?": {"en": "Are you sure you want to delete your account?", "ja": "退会しますか？", "zh": "确定要注销会员吗？"},
    "탈퇴하시겠습니까?": {"en": "Are you sure you want to delete your account?", "ja": "退会しますか？", "zh": "确定要注销会员吗？"},
    "탈퇴가 완료되었습니다.": {"en": "Your account has been deleted.", "ja": "退会が完了しました。", "zh": "会员注销已完成。"},
    "회원탈퇴가 완료되었습니다.": {"en": "Your account has been deleted.", "ja": "退会が完了しました。", "zh": "会员注销已完成。"},
    "회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.": {"en": "Please review the notice before deleting your account.", "ja": "退会申請前に案内事項を必ずご確認ください。", "zh": "申请注销会员前，请务必确认相关说明。"},
    "탈퇴 후 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.": {"en": "After account deletion, personal information and purchase records are stored and deleted according to applicable laws.", "ja": "退会後、個人情報および購入履歴は関連法令に基づき保管後、破棄されます。", "zh": "注销后，个人信息及购买记录将按相关法规保存后销毁。"},
    "탈퇴 후에는 회원정보가 삭제되며 복구할 수 없습니다.": {"en": "After account deletion, your member information will be deleted and cannot be restored.", "ja": "退会後は会員情報が削除され、復元できません。", "zh": "注销后会员信息将被删除，且无法恢复。"},
    "진행 중인 주문이 있는 경우 회원탈퇴가 제한될 수 있습니다.": {"en": "Account deletion may be restricted if you have orders in progress.", "ja": "進行中の注文がある場合、退会が制限されることがあります。", "zh": "如有进行中的订单，会员注销可能会受到限制。"},
    # 장바구니/주문 알림 팝업(ui.alert 본문) — 사전에 키가 없어 한국어로 노출되던 문구
    "구매 불가능한 상품이 존재합니다. 장바구니 상품을 확인해 주세요!": {"en": "Some items can’t be purchased. Please check the items in your cart.", "ja": "購入できない商品があります。カートの商品をご確認ください。", "zh": "购物车中有无法购买的商品，请确认购物车商品！"},
    "구매확정 하시겠습니까?": {"en": "Confirm this purchase?", "ja": "購入を確定しますか？", "zh": "确认购买吗？"},
    "재고가 부족합니다. 현재 %s개의 재고가 남아 있습니다.": {"en": "Out of stock. Only %s left in stock.", "ja": "在庫が不足しています。現在%s個の在庫が残っています。", "zh": "库存不足，当前剩余%s件。"},
    # 회원가입 정보입력(join.php) placeholder / validation
    "- 없이 입력하세요.": {"en": "Enter numbers only, without hyphens.", "ja": "ハイフンなしで入力してください。", "zh": "请不加连字符输入。"},
    "우편번호": {"en": "Postal code", "ja": "郵便番号", "zh": "邮政编码"},
    "도로명 주소 검색": {"en": "Search address", "ja": "住所を検索", "zh": "搜索地址"},
    "상세 주소를 입력해 주세요.": {"en": "Enter detailed address.", "ja": "詳しい住所を入力してください。", "zh": "请输入详细地址。"},
    "주소검색": {"en": "Find Address", "ja": "住所検索", "zh": "查找地址"},
    "필수항목 입니다.": {"en": "This field is required.", "ja": "必須項目です。", "zh": "必填项。"},
    "최소 4 이상 입력해 주세요.": {"en": "Please enter at least 4 characters.", "ja": "4文字以上入力してください。", "zh": "请输入至少4个字符。"},
    "최소 10 이상 입력해 주세요.": {"en": "Please enter at least 10 characters.", "ja": "10文字以上入力してください。", "zh": "请输入至少10个字符。"},
    "최대 16 이하 입력해 주세요.": {"en": "Please enter no more than 16 characters.", "ja": "16文字以下で入力してください。", "zh": "请输入不超过16个字符。"},
    "이메일을 정확하게 입력해주세요.": {"en": "Please enter a valid email address.", "ja": "正しいメールアドレスを入力してください。", "zh": "请输入有效的邮箱地址。"},
    "안전한 비밀번호 입니다.": {"en": "This is a secure password.", "ja": "安全なパスワードです。", "zh": "这是安全的密码。"},
    "사용불가! 영문대/소문자, 숫자, 특수문자 중 2가지 이상 조합하세요.": {"en": "Cannot use this password. Combine at least two of uppercase/lowercase letters, numbers, and special characters.", "ja": "使用できません。英大文字/小文字、数字、特殊文字のうち2種類以上を組み合わせてください。", "zh": "不可使用。请组合英文大小写字母、数字、特殊字符中的两种以上。"},
    "비밀번호가 서로 다릅니다.": {"en": "Passwords do not match.", "ja": "パスワードが一致しません。", "zh": "两次输入的密码不一致。"},
    "사용가능한 아이디입니다.": {"en": "This ID is available.", "ja": "使用可能なIDです。", "zh": "该账号可用。"},
    "사용가능한 이메일입니다.": {"en": "This email is available.", "ja": "使用可能なメールアドレスです。", "zh": "该邮箱可用。"},
    "영문 소문자·숫자만 입력할 수 있어요": {"en": "Only lowercase letters and numbers are allowed.", "ja": "英小文字と数字のみ入力できます。", "zh": "仅可输入英文小写字母和数字。"},
    "년": {"en": "Year", "ja": "年", "zh": "年"},
    "월": {"en": "Month", "ja": "月", "zh": "月"},
    "일": {"en": "Day", "ja": "日", "zh": "日"},
}

# 12cutEditor.html(스토리 만들기 편집기) 전용 키. 편집기는 /dobuddy/files/{lang}.html를
# 그대로 fetch해 $t()/data-t로 치환하므로, 원문 키를 EXACT(스마트따옴표·이모지·<br>·<b>·$토큰)로 추가.
EDITOR_KEYS = {
    # 탭 / 하단 버튼 / 타이틀
    "12컷 선택": {"en": "Select 12 Cuts", "ja": "12カットを選択", "zh": "选择12格"},
    "순서 선택": {"en": "Arrange Order", "ja": "順番を選択", "zh": "选择顺序"},
    "순서선택": {"en": "Arrange Order", "ja": "順番を選択", "zh": "选择顺序"},
    "트리밍": {"en": "Trim", "ja": "トリミング", "zh": "裁剪"},
    "스토리만들기": {"en": "Make Your Story", "ja": "ストーリーをつくる", "zh": "创建你的故事"},
    "처음부터다시": {"en": "Start Over", "ja": "最初からやり直す", "zh": "重新开始"},
    "스토리 미리보기": {"en": "Preview Story", "ja": "ストーリーをプレビュー", "zh": "预览故事"},
    "스토리 저장하기": {"en": "Save Story", "ja": "ストーリーを保存", "zh": "保存故事"},
    "사진 순서 초기화": {"en": "Reset Photo Order", "ja": "写真の順番をリセット", "zh": "重置照片顺序"},
    "삭제하기": {"en": "Delete", "ja": "削除する", "zh": "删除"},
    "장바구니 이동": {"en": "Go to Cart", "ja": "カートへ移動", "zh": "前往购物车"},
    "저장이 완료되었습니다.": {"en": "Saved successfully.", "ja": "保存が完了しました。", "zh": "保存完成。"},
    "스토리 저장 완료 !": {"en": "Story Saved!", "ja": "ストーリーの保存が完了しました！", "zh": "故事保存完成！"},
    "디자인이 장바구니에 추가되었습니다 !": {"en": "Your design has been added to the cart!", "ja": "デザインがカートに追加されました！", "zh": "设计已添加到购物车！"},
    "와우! 너무 예쁘네요 :)": {"en": "Wow, it looks beautiful :)", "ja": "わあ、とても素敵です :)", "zh": "哇，太漂亮了 :)"},
    "장바구니 보기 & 추가 주문하기": {"en": "View Cart & Add Another", "ja": "カートを見る・追加注文する", "zh": "查看购物车并继续加购"},
    "바로 결제하기": {"en": "Checkout Now", "ja": "今すぐ決済する", "zh": "立即支付"},
    # 단계 안내문 (<b>·<br>·😊·$토큰·스마트따옴표 보존)
    "<b>‘12컷 선택’ 버튼</b>을 누르고<br>빈 슬라이드에 12컷을 추가해주세요.😊": {"en": "<b>Tap the ‘Select 12 Cuts’ button</b><br>and add 12 cuts to the empty slides. 😊", "ja": "<b>「12カットを選択」ボタン</b>を押して<br>空のスライドに12カットを追加してください。😊", "zh": "<b>点击‘选择12格’按钮</b><br>将12格添加到空白幻灯片中。😊"},
    "<b>$</b>컷 추가됬어요.<br><b>$</b>컷 더 추가해주세요.😊": {"en": "<b>$</b> cut(s) added.<br>Please add <b>$</b> more. 😊", "ja": "<b>$</b>カット追加しました。<br>あと<b>$</b>カット追加してください。😊", "zh": "已添加<b>$</b>格。<br>请再添加<b>$</b>格。😊"},
    "<b>12</b>컷 선택이 완료되었어요.😊<br><b>“순서 선택” 버튼</b>을 눌러주세요.": {"en": "<b>12</b> cuts selected. 😊<br>Now tap the <b>“Arrange Order” button</b>.", "ja": "<b>12</b>カットの選択が完了しました。😊<br><b>「順番を選択」ボタン</b>を押してください。", "zh": "已完成<b>12</b>格选择。😊<br>请点击<b>“选择顺序”按钮</b>。"},
    "슬라이드에 나오는 사진의 순서를 정해주세요. 😊<br>완료되면, <b>“트리밍” 버튼</b>을 눌러주세요.": {"en": "Set the order of the photos in your slides. 😊<br>When done, tap the <b>“Trim” button</b>.", "ja": "スライドに表示される写真の順番を決めてください。😊<br>完了したら<b>「トリミング」ボタン</b>を押してください。", "zh": "请排列幻灯片中照片的顺序。😊<br>完成后请点击<b>“裁剪”按钮</b>。"},
    "필름 사이즈에 알맞게 트리밍하세요. 😊<br>완료되면, <b>“스토리 미리보기” 버튼</b>을 눌러주세요.": {"en": "Trim each photo to fit the film size. 😊<br>When done, tap the <b>“Preview Story” button</b>.", "ja": "フィルムサイズに合わせてトリミングしてください。😊<br>完了したら<b>「ストーリーをプレビュー」ボタン</b>を押してください。", "zh": "请按胶片尺寸进行裁剪。😊<br>完成后请点击<b>“预览故事”按钮</b>。"},
    "‘화면 터치’ 또는 ‘마우스 휠’로 회전시켜<br>사진과 스토리가  잘 적용되었는지 확인해 주세요 😊": {"en": "Rotate with a ‘screen touch’ or ‘mouse wheel’<br>to check your photos and story look right. 😊", "ja": "「画面タッチ」または「マウスホイール」で回転させて<br>写真とストーリーが正しく反映されたか確認してください。😊", "zh": "通过‘触摸屏幕’或‘鼠标滚轮’旋转，<br>确认照片与故事是否正确呈现。😊"},
    "세로방향으로<br>이용해주세요": {"en": "Please use in<br>portrait mode", "ja": "縦向きで<br>ご利用ください", "zh": "请使用<br>竖屏模式"},
    "카트저장에 실패하였습니다.": {"en": "Failed to save to cart.", "ja": "カートへの保存に失敗しました。", "zh": "保存到购物车失败。"},
    # 툴팁
    "클릭하면 이미지를 선택할 수 있어요": {"en": "Tap to select an image", "ja": "タップすると画像を選択できます", "zh": "点击即可选择图片"},
    "클릭하면 이미지를 삭제할 수 있어요": {"en": "Tap to delete the image", "ja": "タップすると画像を削除できます", "zh": "点击即可删除图片"},
    "레드 포인트를 움직이면<br>줌/회전을 할 수 있어요": {"en": "Drag the red point<br>to zoom and rotate", "ja": "赤いポイントを動かすと<br>ズーム・回転ができます", "zh": "拖动红点<br>即可缩放/旋转"},
    "클릭하면 이미지를 확대할 수 있어요": {"en": "Tap to enlarge the image", "ja": "タップすると画像を拡大できます", "zh": "点击即可放大图片"},
    "클릭해서 사진의 순서를 정해주세요": {"en": "Tap to set the photo order", "ja": "タップして写真の順番を決めてください", "zh": "点击以排列照片顺序"},
    # STORY GUIDE 캐러셀 (data-t 정적: 키 = innerHTML 그대로, <br> 포함)
    "1단계: 12장 선택하기": {"en": "Step 1: Select 12 Photos", "ja": "ステップ1：12枚を選択", "zh": "第1步：选择12张"},
    "'슬라이드 섬네일'을 클릭하시고<br>사진을 선택해 주세요.<br><br>나누고 간직할 이야기들을<br>당신만의 스토리로 만들어 보세요.": {"en": "Tap a ‘slide thumbnail’<br>and choose a photo.<br><br>Turn the moments you want to share and keep<br>into a story of your own.", "ja": "「スライドサムネイル」をタップして<br>写真を選んでください。<br><br>分かち合い、残したい物語を<br>あなただけのストーリーにしてみてください。", "zh": "点击‘幻灯片缩略图’<br>并选择照片。<br><br>把想分享与珍藏的瞬间，<br>打造成属于你的故事。"},
    "2단계: 순서 선택하기": {"en": "Step 2: Arrange the Order", "ja": "ステップ2：順番を選択", "zh": "第2步：选择顺序"},
    "슬라이드에 나오는<br>사진의 순서를 정해주세요.<br><br>시간 순이 아니어도 괜찮아요.<br>감정의 흐름으로 연결해보세요.": {"en": "Set the order of the photos<br>that appear in your slides.<br><br>They don’t have to be in time order.<br>Connect them by the flow of emotion.", "ja": "スライドに表示される<br>写真の順番を決めてください。<br><br>時系列でなくても大丈夫です。<br>感情の流れでつないでみてください。", "zh": "请排列幻灯片中<br>出现的照片顺序。<br><br>不必按时间顺序，<br>可按情感的流动来连接。"},
    "3단계: 사진 트리밍하기": {"en": "Step 3: Trim Your Photos", "ja": "ステップ3：写真をトリミング", "zh": "第3步：裁剪照片"},
    "더 멋진 스토리를 위해서<br>이야기의 한 장면들을<br>완벽하게 트리밍하세요.<br><br>줌과 회전으로 중요한 순간을<br>강조해 보세요.": {"en": "For an even better story,<br>trim each scene of your tale<br>to perfection.<br><br>Use zoom and rotation<br>to highlight the moments that matter.", "ja": "より素敵なストーリーのために<br>物語の一場面ひとつひとつを<br>完璧にトリミングしてください。<br><br>ズームと回転で大切な瞬間を<br>強調してみてください。", "zh": "为了更精彩的故事，<br>请将故事的每个画面<br>裁剪到完美。<br><br>用缩放和旋转<br>突出重要的瞬间。"},
    "다시 보지 않기": {"en": "Don’t show again", "ja": "今後表示しない", "zh": "不再显示"},
    # Category 2: 코드에서 $t()로 래핑한 알림/토스트 본문 + onbeforeunload
    "사진을 삭제하시겠습니까?": {"en": "Delete this photo?", "ja": "この写真を削除しますか？", "zh": "确定要删除这张照片吗？"},
    "사진 트리밍 완료하셨나요?": {"en": "Finished trimming your photos?", "ja": "写真のトリミングは完了しましたか？", "zh": "照片裁剪完成了吗？"},
    "저장에 실패했습니다.": {"en": "Save failed.", "ja": "保存に失敗しました。", "zh": "保存失败。"},
    "일부 이미지를 불러오지 못했습니다. 다른 형식으로 저장한 뒤 다시 시도해주세요.": {"en": "Some images could not be loaded. Please save them in another format and try again.", "ja": "一部の画像を読み込めませんでした。別の形式で保存してから、もう一度お試しください。", "zh": "部分图片无法读取。请保存为其他格式后再试。"},
    "$px 미만인 이미지는 화질열화로 사용하실 수 없습니다.": {"en": "Images smaller than $px can’t be used due to quality loss.", "ja": "$px未満の画像は画質劣化のため使用できません。", "zh": "小于$px的图片因画质下降无法使用。"},
    "12컷 선택<br>완료해주세요": {"en": "Please finish<br>selecting 12 cuts", "ja": "12カットの選択を<br>完了してください", "zh": "请先完成<br>12格的选择"},
    "순서 선택<br>완료해주세요": {"en": "Please finish<br>arranging the order", "ja": "順番の選択を<br>完了してください", "zh": "请先完成<br>顺序选择"},
    "편집중인 스토리가 삭제됩니다.": {"en": "Your story in progress will be discarded.", "ja": "編集中のストーリーが削除されます。", "zh": "正在编辑的故事将被删除。"},
}


# JA만 비어 있던 기능성 문구(EN/ZH는 이미 채움) → JA 보완.
JA_FILL = {
    "<strong>상품이 장바구니에 담겼습니다.</strong><br>바로 확인하시겠습니까?": "<strong>商品がカートに追加されました。</strong><br>今すぐ確認しますか？",
    "이름을 입력해주세요": "名前を入力してください",
    "로그인하셔야 본 서비스를 이용하실 수 있습니다.": "ログインすると本サービスをご利用いただけます。",
    "예약 판매": "予約販売",
}


def is_empty(v):
    return not (isinstance(v, str) and v.strip())


def fill(lang):
    path = os.path.join(BASE, f"{lang}.html")
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    filled, skipped_b, missing_map = 0, 0, []
    # 1) 기존 빈 값 채움 (en/zh는 T, ja는 JA_FILL)
    for k, v in list(d.items()):
        if not is_empty(v):
            continue
        if k in SKIP:
            skipped_b += 1
            continue
        if lang == "ja":
            if k in JA_FILL:
                d[k] = JA_FILL[k]
                filled += 1
            continue  # ja는 그 외 빈 값 손대지 않음(BD2 고유명 등)
        tr = T.get(k)
        if not tr or lang not in tr:
            missing_map.append(k)
            continue
        d[k] = tr[lang]
        filled += 1
    # 2) $t로 감쌌으나 없던 신규 키 추가 (일반 + 편집기)
    added = 0
    for k, tr in {**NEW_KEYS, **EDITOR_KEYS}.items():
        if k not in d or is_empty(d.get(k)):
            d[k] = tr[lang]
            added += 1
    out_path = os.path.join(OUT, f"{lang}.html")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, separators=(",", ":"))
    return filled, added, skipped_b, missing_map


def main():
    os.makedirs(OUT, exist_ok=True)
    for lang in ("en", "ja", "zh"):
        filled, added, skipped_b, missing = fill(lang)
        print(f"[{lang}] filled={filled} new_keys_added={added} skipped(ClassB/broken)={skipped_b} unmapped={len(missing)}")
        if missing and lang != "ja":
            for k in missing:
                print(f"    UNMAPPED: {k!r}")


if __name__ == "__main__":
    main()
