/**
 * Featured society doctors.
 *
 * Every reader-facing string carries both languages. English is the default;
 * the Bangla is transcribed from the printed profile brochures supplied by
 * the society, and the English is a translation of those same brochures.
 *
 * Journals stay empty until the society provides them — the profile renders a
 * "not yet provided" note rather than inventing entries.
 */

export type Lang = "en" | "bn";

/** A string that exists in both languages. */
export type Localized = { en: string; bn: string };

export type Chamber = {
    name: Localized;
    address: Localized;
    /** Serial booking numbers, as printed. */
    phones: string[];
};

export type Doctor = {
    slug: string;
    name: Localized;
    /** Post-nominals — identical in both languages. */
    qualifications: string;
    designation: Localized;
    specialities: Localized;
    /** Short credential line as supplied by the society. */
    experienceSummary?: string;
    posting: Localized;
    practicingBranch?: Localized;
    district: string;
    photo: string;
    bio: { en: string[]; bn: string[] };
    journals: string[];
    chambers: Chamber[];
};

export const DOCTORS: Doctor[] = [
    {
        slug: "zia-hayder-bosunia",
        name: {
            en: "Asso. Prof. Dr. Zia Hayder Bosunia",
            bn: "ডাঃ মোঃ জিয়া হায়দার বসুনিয়া",
        },
        qualifications:
            "MBBS, BCS, FCPS (Medicine), MD (Hepatology), MACP (USA), FRCP (Glasgow)",
        designation: {
            en: "Associate Professor & Head of The Department",
            bn: "সহযোগী অধ্যাপক ও বিভাগীয় প্রধান",
        },
        specialities: { en: "Hepatology", bn: "হেপাটোলজি" },
        experienceSummary:
            "MBBS, FCPS (Medicine), MD (Hepatology), RpMCH",
        posting: {
            en: "Department of Hepatology, Rangpur Medical College, Rangpur",
            bn: "লিভার বিভাগ, রংপুর মেডিকেল কলেজ, রংপুর",
        },
        practicingBranch: {
            en: "Popular Diagnostic Centre Ltd. (Rangpur Branch)",
            bn: "পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড (রংপুর শাখা)",
        },
        district: "Rangpur",
        photo: "/doctors/zia-hayder-bosunia.webp",
        bio: {
            en: [
                "Dr. Md. Zia Hayder Bosunia is an experienced liver and medicine specialist. He currently serves as Associate Professor and Head of the Department of Hepatology at Rangpur Medical College. For the past 12 years he has been providing high-quality specialist care to liver patients across the Rangpur region.",
                "Through endoscopy he has made a range of modern and invasive treatments available to patients. In particular, the introduction of ERCP and other endoscopic therapeutic procedures in the Rangpur division is his contribution. To date he has successfully performed 50,000 endoscopies, 10,000 colonoscopies and more than 1,300 ERCPs.",
                "Dr. Bosunia earned his MBBS from Chittagong Medical College in 2002 and joined government service in 2006 after passing the BCS (Health) examination. He went on to obtain FCPS in Medicine from the Bangladesh College of Physicians and Surgeons (BCPS) in 2013, and in the same year received his MD in Hepatology (Liver) from Bangladesh Medical University (BMU).",
                "He received higher training in ERCP at Global Hospital, Chennai in 2016 and at Global Hospital, Mumbai in 2018. In 2019 he took advanced training in minimally invasive gastrointestinal endoscopy at Zhengzhou University, China. Another significant chapter was added to his career in 2023, when he obtained the FRCP from the Royal College of Physicians and Surgeons in Glasgow, United Kingdom.",
                "Dr. Bosunia was granted membership of the American College of Physicians (ACP) in 2022. He is a member of the European Association for the Study of the Liver (EASL), the Asian Pacific Association for the Study of the Liver (APASL), the Indian National Association for Study of the Liver (INASL) and the Association for the Study of the Liver Diseases Bangladesh (ASLDB).",
                "Dr. Bosunia is also actively engaged in research work. His research papers have been published in various reputed national and international medical journals. He also regularly takes part in national and international scientific conferences and presents his research work.",
                "Dr. Zia Hayder Bosunia's contribution to the advancement of liver treatment in the Rangpur division is undeniable. His tireless effort and dedication have opened a new door of service for patients.",
            ],
            bn: [
                "ডাঃ মোঃ জিয়া হায়দার বসুনিয়া একজন অভিজ্ঞ লিভার ও মেডিসিন বিশেষজ্ঞ চিকিৎসক। বর্তমানে তিনি রংপুর মেডিকেল কলেজের লিভার বিভাগের সহযোগী অধ্যাপক ও বিভাগীয় প্রধান হিসেবে কর্মরত রয়েছেন। গত ১২ বছর ধরে তিনি রংপুর অঞ্চলের লিভারের রোগীদের উন্নতমানের বিশেষজ্ঞ চিকিৎসা প্রদান করে আসছেন।",
                "তিনি এন্ডোস্কোপির মাধ্যমে রোগীদের জন্য বিভিন্ন ধরনের আধুনিক এবং ইনভেসিভ চিকিৎসা নিশ্চিত করেছেন। বিশেষ করে রংপুর বিভাগে ইআরসিপি (ERCP) এবং অন্যান্য এন্ডোস্কোপিক থেরাপিউটিক প্রক্রিয়ার প্রবর্তন তার অবদান। এ পর্যন্ত তিনি ৫০,০০০ এন্ডোস্কপি, ১০,০০০ কোলনোস্কপি এবং ১,৩০০-এর বেশি ইআরসিপি সফলভাবে সম্পন্ন করেছেন।",
                "ডাঃ বসুনিয়া ২০০২ সালে চট্টগ্রাম মেডিকেল কলেজ থেকে এমবিবিএস (MBBS) ডিগ্রি অর্জন করেন এবং ২০০৬ সালে বিসিএস স্বাস্থ্য পরীক্ষায় উত্তীর্ণ হয়ে সরকারি চাকরিতে যোগ দেন। পরবর্তীতে তিনি ২০১৩ সালে বাংলাদেশ কলেজ অব ফিজিশিয়ানস এন্ড সার্জনস (BCPS) থেকে মেডিসিনে এফসিপিএস (FCPS) ডিগ্রি অর্জন করেন এবং একই বছরে বাংলাদেশ মেডিকেল বিশ্ববিদ্যালয় (BMU) থেকে হেপাটোলজিতে (লিভার) এমডি (MD) ডিগ্রী লাভ করেন।",
                "তিনি ২০১৬ সালে চেন্নাইয়ের গ্লোবাল হাসপাতাল এবং ২০১৮ সালে মুম্বাইয়ের গ্লোবাল হাসপাতাল থেকে ইআরসিপি-এর উপর উচ্চতর প্রশিক্ষণ গ্রহণ করেন। এছাড়াও, ২০১৯ সালে তিনি চীনের ঝেংঝো ইউনিভার্সিটি থেকে মিনিমালি ইনভেসিভ গ্যাস্ট্রোইনটেস্টিনাল এন্ডোস্কোপির উপর উন্নত প্রশিক্ষণ নেন। তার ক্যারিয়ারে আরও এক গুরুত্বপূর্ণ অধ্যায় যুক্ত হয় ২০২৩ সালে, যখন তিনি যুক্তরাজ্যের গ্লাসগোতে রয়েল কলেজ অফ ফিজিশিয়ানস অ্যান্ড সার্জনস থেকে এফআরসিপি (FRCP) ডিগ্রি অর্জন করেন।",
                "ডাঃ বসুনিয়া ২০২২ সালে আমেরিকান কলেজ অফ ফিজিশিয়ানস (ACP) এর সদস্যপদ লাভ করেন। তিনি ইউরোপীয় অ্যাসোসিয়েশন ফর দ্য স্টাডি অফ দ্য লিভার (EASL), এশিয়া প্যাসিফিক অ্যাসোসিয়েশন ফর দ্য স্টাডি লিভার (APASL), ইন্ডিয়ান অ্যাসোসিয়েশন ফর দ্য স্টাডি অফ দ্য লিভার (INASL) এবং অ্যাসোসিয়েশন ফর দ্য স্টাডি অফ দ্য লিভার ডিজিজেস বাংলাদেশ (ASLDB) - এর সদস্য।",
                "ডাঃ বসুনিয়া গবেষণামূলক কাজেও সক্রিয়ভাবে যুক্ত আছেন। তার গবেষণাপত্রগুলো জাতীয় ও আন্তর্জাতিক বিভিন্ন স্বনামধন্য মেডিকেল জার্নালে প্রকাশিত হয়েছে। এছাড়াও, তিনি নিয়মিতভাবে জাতীয় ও আন্তর্জাতিক বৈজ্ঞানিক সম্মেলনে অংশগ্রহণ করেন এবং তার গবেষণা কর্ম উপস্থাপন করেন।",
                "রংপুর বিভাগের লিভার চিকিৎসার উন্নয়নে ডাঃ জিয়া হায়দার বসুনিয়ার অবদান অনস্বীকার্য। তার নিরলস পরিশ্রম ও একাগ্রতা রোগীদের জন্য সেবার নতুন দ্বার উন্মোচন করেছে।",
            ],
        },
        journals: [],
        chambers: [
            {
                name: {
                    en: "Popular Diagnostic Centre Ltd. (Rangpur Branch)",
                    bn: "পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড (রংপুর শাখা)",
                },
                address: {
                    en: "77/1, Road No-1, Dhap, Jail Road, Rangpur.",
                    bn: "৭৭/১, রোড নং-১, ধাপ, জেল রোড, রংপুর।",
                },
                phones: ["09666 787813", "09666787813"],
            },
        ],
    },
    {
        slug: "prabhat-kumar-poddar",
        name: {
            en: "Dr. Prabhat Kumar Poddar",
            bn: "ডা. প্রভাত কুমার পোদ্দার",
        },
        qualifications:
            "MBBS, BCS (Health), FCPS (Medicine), MD (Hepatology), FRCP (Glasgow)",
        designation: {
            en: "Associate Professor",
            bn: "সহযোগী অধ্যাপক",
        },
        specialities: {
            en: "Hepatology, Gastroenterology & Medicine",
            bn: "লিভার, পরিপাকতন্ত্র ও মেডিসিন",
        },
        posting: {
            en: "Department of Hepatology, Gopalganj Medical College",
            bn: "লিভার বিভাগ, গোপালগঞ্জ মেডিকেল কলেজ",
        },
        district: "Gopalganj",
        photo: "/doctors/prabhat-kumar-poddar.webp",
        bio: {
            en: [
                "Dr. Prabhat Kumar Poddar is a distinguished liver, gastroenterology and medicine specialist in Bangladesh, currently serving as Associate Professor in the Department of Hepatology at Gopalganj Medical College. He passed MBBS from Sir Salimullah Medical College, Dhaka in 1999. In 2003 he joined as a BCS (Health) cadre officer and went on to provide health services at various government hospitals across the country. He then passed FCPS (Medicine) from the Bangladesh College of Physicians and Surgeons (BCPS) in 2008, and obtained his MD (Hepatology) from Bangabandhu Sheikh Mujib Medical University in 2009. In 2023 he obtained the Fellowship (FRCP, Glasgow) of the Royal College of Physicians and Surgeons of Glasgow (RCPSG), UK.",
                "Dr. Prabhat Kumar Poddar has been providing medical care to patients in different parts of the country for 25 years. With around 15 years of service and working experience in the liver department of Sir Salimullah Medical College Mitford Hospital, he is today regarded as one of Bangladesh's most dependable liver and gastroenterology specialists.",
                "Over his career he has undertaken various higher training programmes at home and abroad on the diseases of the liver and hepatology, their most modern treatments, and a range of interventional techniques. Professionally, Dr. Prabhat Kumar Poddar has attended seminars, symposia and conferences on liver and gastroenterology at home and abroad, and has presented scientific papers on liver topics. Around 20 of his scientific research papers have been published in various national and international journals.",
                "Dr. Prabhat Kumar Poddar is an honoured member of the Asian Pacific Association for the Study of the Liver (APASL), the South Asian Association for the Study of the Liver (SAASL) and the European Association for the Study of the Liver (EASL). He is also an honoured member of the Association for the Study of the Liver Diseases Bangladesh (ASLDB), the largest organisation of liver specialist physicians in Bangladesh.",
            ],
            bn: [
                "ডা. প্রভাত কুমার পোদ্দার বাংলাদেশের একজন স্বনামধন্য লিভার, পরিপাকতন্ত্র ও মেডিসিন বিশেষজ্ঞ চিকিৎসক, যিনি বর্তমানে গোপালগঞ্জ মেডিকেল কলেজ এর লিভার বিভাগে সহযোগী অধ্যাপক হিসেবে কর্মরত আছেন। ডা. প্রভাত কুমার পোদ্দার ১৯৯৯ ইং সালে স্যার সলিমুল্লাহ মেডিকেল কলেজ, ঢাকা থেকে এমবিবিএস (MBBS) পাশ করেন। এর পরে ২০০৩ সালে তিনি বিসিএস (স্বাস্থ্য) ক্যাডার অফিসার হিসেবে যোগদান করেন এবং পর্যায়ক্রমে দেশের বিভিন্ন সরকারী হাসপাতালে স্বাস্থ্যসেবা প্রদান করেন। পরবর্তীতে ২০০৮ সালে বাংলাদেশ কলেজ অব ফিজিশিয়ানস এন্ড সার্জনস (BCPS) থেকে এফসিপিএস (মেডিসিন) পাশ করেন এবং ২০০৯ সালে বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় থেকে এমডি (হেপাটোলজি) ডিগ্রি অর্জন করেন। ডা. প্রভাত কুমার পোদ্দার ২০২৩ সালে রয়েল কলেজ অব ফিজিশিয়ানস এন্ড সার্জনস অব গ্লাসগো (RCPSG), ইউকে এর ফেলোশিপ (FRCP, Glasgow) অর্জন করেন।",
                "ডা. প্রভাত কুমার পোদ্দার দীর্ঘ ২৫ বছর যাবত দেশের বিভিন্ন এলাকায় রোগীদের চিকিৎসা সেবা দিয়ে আসছেন। এছাড়াও প্রায় ১৫ বছর যাবত স্যার সলিমুল্লাহ মেডিকেল কলেজ মিটফোর্ড হাসপাতালে লিভার বিভাগে সেবা ও কর্ম অভিজ্ঞতায় তিনি বর্তমানে বাংলাদেশের একজন অত্যন্ত নির্ভরযোগ্য লিভার ও পরিপাকতন্ত্র বিশেষজ্ঞদের একজন।",
                "তিনি তার কর্মজীবনে লিভার রোগ তথা হেপাটোলজির বিভিন্ন রোগ, রোগের আধুনিকতম চিকিৎসা ও বিভিন্ন ইন্টারভেনশনাল প্রযুক্তির উপর দেশ ও দেশের বাইরে বিভিন্ন উচ্চতর প্রশিক্ষন গ্রহন করেন। পেশাগত জীবনে ডা. প্রভাত কুমার পোদ্দার দেশ ও বিদেশে লিভার ও গ্যাস্ট্রোএন্টারোলজীর বিভিন্ন সেমিনার, সিম্পোজিয়াম এবং কনফারেন্সে যোগদান ও লিভার বিষয়ে বৈজ্ঞানিক প্রবন্ধ উপস্থাপন করেছেন। বিভিন্ন জাতীয় ও আন্তর্জাতিক জার্নালে তার প্রায় ২০ টি বৈজ্ঞানিক গবেষণাপত্র প্রকাশিত হয়েছে।",
                "ডা. প্রভাত কুমার পোদ্দার Asian Pacific Association for the Study of the Liver (APASL), South Asian Association for the Study of the Liver (SAASL) এবং European Association for the Study of the Liver (EASL) এর সম্মানিত সদস্য। এছাড়াও ডা. প্রভাত কুমার পোদ্দার বাংলাদেশে লিভার বিশেষজ্ঞ চিকিৎসকদের সর্ববৃহৎ সংগঠন Association for the Study of the Liver Diseases Bangladesh (ASLDB) এর সম্মানিত সদস্য।",
            ],
        },
        journals: [],
        chambers: [],
    },
];

export const getDoctor = (slug: string) =>
    DOCTORS.find((d) => d.slug === slug);

/** UI strings for the doctors section, so the toggle switches chrome too. */
export const UI: Record<Lang, Record<string, string>> = {
    en: {
        doctors: "Doctors",
        intro: "Hepatologists, hepatobiliary surgeons and intervention hepatologists registered with the society.",
        filterByDistrict: "Filter by district",
        allDistricts: "All districts",
        viewDetails: "View details",
        noneInDistrict: "No doctors in",
        tryAnother: "Try another district.",
        backToDoctors: "Back to doctors",
        specialities: "Specialities",
        experienceSummary: "Experience Summary",
        practicingBranch: "Practicing Branch",
        journals: "Journals",
        journalsEmpty: "Publication list not yet provided.",
        chamber: "Chamber Address",
        chamberEmpty: "Chamber details not yet provided.",
        callForSerial: "Call for serial",
    },
    bn: {
        doctors: "চিকিৎসকবৃন্দ",
        intro: "সোসাইটিতে নিবন্ধিত হেপাটোলজিস্ট, হেপাটোবিলিয়ারি সার্জন ও ইন্টারভেনশন হেপাটোলজিস্টগণ।",
        filterByDistrict: "জেলা অনুযায়ী খুঁজুন",
        allDistricts: "সব জেলা",
        viewDetails: "বিস্তারিত দেখুন",
        noneInDistrict: "কোনো চিকিৎসক নেই",
        tryAnother: "অন্য জেলা নির্বাচন করুন।",
        backToDoctors: "চিকিৎসক তালিকায় ফিরুন",
        specialities: "বিশেষত্ব",
        experienceSummary: "অভিজ্ঞতার সারসংক্ষেপ",
        practicingBranch: "প্র্যাকটিসিং শাখা",
        journals: "জার্নাল",
        journalsEmpty: "প্রকাশনার তালিকা এখনো দেওয়া হয়নি।",
        chamber: "চেম্বারের ঠিকানা",
        chamberEmpty: "চেম্বারের তথ্য এখনো দেওয়া হয়নি।",
        callForSerial: "সিরিয়ালের জন্য কল করুন",
    },
};
