-- Alapon: make the Editorial section go live and make YOUR account an editor (admin). Replace you@example.com below with your sign-up email.
-- Run ONCE in the Supabase SQL editor. Safe to re-run. Requires migrations 0001-0004.

do $seed$
declare
  editorial_id uuid;
begin
  select id into editorial_id from auth.users where email = 'editorial@alapon.invalid';

  if editorial_id is null then
    editorial_id := gen_random_uuid();
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, recovery_token, email_change, email_change_token_new,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) values (
      editorial_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'editorial@alapon.invalid', '', now(),
      '', '', '', '',
      '{"provider":"email","providers":["email"]}', '{"name":"Alapon Editorial"}', now(), now()
    );
  end if;

  -- The signup trigger created a private profile; make it the public editorial byline.
  update public.profiles
     set username = 'alapon_editorial',
         display_name = 'আলাপন সম্পাদকীয়',
         privacy_level = 'public',
         is_adult = true
   where id = editorial_id;

  -- created_at is staggered into the past so the 5-posts-per-hour limit does not apply.
  insert into public.posts (author_id, category_slug, title, body, status, moderation_status, created_at)
  select editorial_id, v.category_slug, v.title, v.body, 'published', 'approved',
         now() - (v.n * interval '7 hours')
  from (values
    ('pujor-adda', $b$বঙ্গের প্রাচীনতম বারোয়ারি পুজো$b$, $b$দুর্গাপূজা আগে মূলত জমিদার ও অভিজাত বাড়ির উৎসব ছিল। ১৭৯০ সালে হুগলির গুপ্তিপাড়ায় বারোজন বন্ধু মিলে চাঁদা তুলে যে পুজো করেন, তাকেই প্রথম 'বারোয়ারি' পুজো বলা হয় - সেখান থেকেই আজকের পাড়ার পুজোর সূচনা। কলকাতার বারিষার সাবর্ণ রায়চৌধুরী পরিবারের পুজো আবার শুরু হয় ১৬১০ সালে। আপনার পাড়ার পুজো কত বছরের পুরোনো?$b$, 1),
    ('pujor-adda', $b$কেন শরৎকালে পুজো? 'অকালবোধন'-এর গল্প$b$, $b$প্রাচীন রীতিতে দেবীর আরাধনা হতো বসন্তে। কৃত্তিবাসী রামায়ণ অনুযায়ী রাম রাবণবধের আগে শরৎকালে, অর্থাৎ দেবতাদের নিদ্রার সময়ে, দুর্গাকে জাগিয়ে পুজো করেন। অসময়ের এই আরাধনাকেই বলে 'অকালবোধন', আর সেই থেকেই বাংলায় শারদীয়া দুর্গাপূজার প্রচলন। শরতের কাশফুল আর শিউলির সঙ্গে তাই পুজোর এমন গভীর যোগ।$b$, 2),
    ('pujor-adda', $b$সপ্তমীর ভোরে নবপত্রিকা - কলাবউ কে?$b$, $b$সপ্তমীর সকালে যাঁকে গঙ্গায় স্নান করিয়ে ঠাকুরের পাশে বসানো হয়, তিনি কোনো বউ নন - নয়টি গাছের এক গুচ্ছ, নবপত্রিকা। কলা, কচু, হলুদ, জয়ন্তী, বেল, ডালিম, অশোক, মানকচু আর ধান - এই নয় গাছ মিলে ফসল ও প্রকৃতির শক্তির প্রতীক। শাড়ি পরানো এই গুচ্ছকেই আমরা আদর করে 'কলাবউ' বলি।$b$, 3),
    ('pujor-adda', $b$মহালয়ার ভোরে রেডিওর সেই কণ্ঠ$b$, $b$মহালয়ার ভোর মানেই বীরেন্দ্রকৃষ্ণ ভদ্রের 'মহিষাসুরমর্দিনী'। এই আকাশবাণী অনুষ্ঠানের সূচনা ১৯৩১ সালে, আর তার পর প্রায় প্রতি বছর বাংলার ঘরে ঘরে ভোরে রেডিও চালানো এক অলিখিত রীতি হয়ে গেছে। ওই দিনই কুমোরটুলিতে প্রতিমার চোখ আঁকা হয় - যাকে বলে 'চক্ষুদান'। আপনার মহালয়ার প্রথম স্মৃতি কী?$b$, 4),
    ('aajker-adda', $b$ইউনেস্কোর স্বীকৃতি পেল কলকাতার দুর্গাপূজা$b$, $b$২০২১ সালের ডিসেম্বরে ইউনেস্কো 'কলকাতার দুর্গাপূজা'-কে মানবজাতির অস্পর্শনীয় সাংস্কৃতিক ঐতিহ্যের তালিকায় স্থান দেয়। ধর্মীয় উৎসব হয়েও এটি শিল্প, নাটক, মণ্ডপসজ্জা আর সামাজিক মেলামেশার এক বিশাল সম্মিলন, সেটাই এই স্বীকৃতির মূল কথা। একটা পুজো কীভাবে গোটা শহরের উৎসব হয়ে ওঠে, ভেবে দেখলে অবাক লাগে।$b$, 5),
    ('golper-asor', $b$বাংলা সাহিত্যের সবচেয়ে পুরোনো নমুনা কোনটি?$b$, $b$চর্যাপদ - বৌদ্ধ সহজিয়া সাধকদের রচিত গান, যা প্রাচীনতম বাংলা সাহিত্যের নিদর্শন হিসেবে ধরা হয়। রচনাকাল আনুমানিক অষ্টম থেকে দ্বাদশ শতক। পুঁথিটি ১৯০৭ সালে নেপালের রাজদরবারের গ্রন্থাগারে খুঁজে পান পণ্ডিত হরপ্রসাদ শাস্ত্রী। ভাবুন তো, আমাদের ভাষার আদি গান হারিয়ে যেতে যেতে ফিরে এল একটা ভাগ্যের জোরে!$b$, 6),
    ('golper-asor', $b$পাল সাম্রাজ্যের রাজা নির্বাচিত হয়েছিলেন$b$, $b$আনুমানিক ৭৫০ খ্রিস্টাব্দের কাছাকাছি বাংলায় যখন চরম অরাজকতা চলছিল - ইতিহাসে যাকে 'মাৎস্যন্যায়' বলা হয় - তখন স্থানীয় সামন্তরা মিলে গোপালকে রাজা নির্বাচিত করেন। তাঁর বংশ পাল সাম্রাজ্য প্রায় চারশো বছর বাংলা ও আশপাশে রাজত্ব করে। এত আগে নির্বাচনের মাধ্যমে রাজা বাছাই, ইতিহাসের এক বিরল ঘটনা।$b$, 7),
    ('golper-asor', $b$'বাঙ্গালাহ' নাম কীভাবে এল?$b$, $b$১৩৫২ সালে সুলতান শামসুদ্দিন ইলিয়াস শাহ বাংলার বিভিন্ন অঞ্চলকে এক করে 'শাহ-ই-বাঙ্গালাহ' উপাধি নেন। মধ্যযুগে বাংলা সালতানাত বাণিজ্য, স্থাপত্য আর সাহিত্যপৃষ্ঠপোষকতার জন্য বিখ্যাত ছিল - রামায়ণ, মহাভারতের বাংলা অনুবাদও তখনকার পৃষ্ঠপোষকতায় শুরু হয়। ভাষা আর অঞ্চলের নাম এক হয়ে ওঠার গল্পটা তখনই গড়ে ওঠে।$b$, 8),
    ('khawa-dawa', $b$রসগোল্লা: বাংলার ভৌগোলিক স্বীকৃতি$b$, $b$২০১৭ সালের নভেম্বরে 'বাংলার রসোগোল্লা' পশ্চিমবঙ্গের নামে ভৌগোলিক নির্দেশক (জিআই) স্বীকৃতি পায়। ছানার এই মিষ্টির জনপ্রিয়তা নিয়ে বাংলা ও ওড়িশার মধ্যে বহুদিন বিতর্ক চলেছে - ওড়িশার 'রসগোলা'ও পরে আলাদা জিআই পেয়েছে। পুজোর ভোগ থেকে বিজয়ার মিষ্টিমুখ, রসগোল্লা ছাড়া বাঙালির উৎসব কি সম্পূর্ণ হয়?$b$, 10)
  ) as v(category_slug, title, body, n)
  where not exists (select 1 from public.posts p where p.title = v.title);
end
$seed$;

-- 2. File the starter posts under Editorial.
update public.posts
   set category_slug = 'editorial'
 where author_id in (select id from public.profiles where username = 'alapon_editorial');

-- 3. Make the editor an admin, so they can publish into Editorial from the site.
--    (The account must exist first: sign up on the site with this email, then run this script.)
update public.profiles
   set role = 'admin', is_adult = true
 where id = (select id from auth.users where email = 'you@example.com');

-- 4. Check the result: expect 10 editorial posts and one admin row.
select 'editorial posts' as what, count(*)::text as value from public.posts where category_slug = 'editorial'
union all
select 'admin: ' || u.email, p.role
from public.profiles p join auth.users u on u.id = p.id
where p.role = 'admin';
