"use strict";

const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();

		try {
			const now = new Date();
			const demoPassword = await bcrypt.hash("password123", 10);
			const adminPassword = await bcrypt.hash("admin12345", 10);

			await queryInterface.bulkInsert(
				"Users",
				[
					{
						id: 100,
						username: "taskgo_admin_seed",
						email: "seed.admin@taskgo.com",
						password: adminPassword,
						role: "admin",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 101,
						username: "arya_buyer",
						email: "arya.buyer@mail.com",
						password: demoPassword,
						role: "buyer",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 102,
						username: "bella_buyer",
						email: "bella.buyer@mail.com",
						password: demoPassword,
						role: "buyer",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 103,
						username: "citra_buyer",
						email: "citra.buyer@mail.com",
						password: demoPassword,
						role: "buyer",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 104,
						username: "dimas_buyer",
						email: "dimas.buyer@mail.com",
						password: demoPassword,
						role: "buyer",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 201,
						username: "raka_seller",
						email: "raka.seller@mail.com",
						password: demoPassword,
						role: "seller",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 202,
						username: "maya_seller",
						email: "maya.seller@mail.com",
						password: demoPassword,
						role: "seller",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 203,
						username: "budi_seller",
						email: "budi.seller@mail.com",
						password: demoPassword,
						role: "seller",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 204,
						username: "nina_seller",
						email: "nina.seller@mail.com",
						password: demoPassword,
						role: "seller",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 205,
						username: "eko_seller",
						email: "eko.seller@mail.com",
						password: demoPassword,
						role: "seller",
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await queryInterface.bulkInsert(
				"UserProfiles",
				[
					{
						id: 100,
						userId: 100,
						fullName: "TaskGo Seed Admin",
						phoneNumber: "081200000100",
						address: "Jl. Admin TaskGo No. 1, Jakarta Selatan",
						avatarUrl: "https://i.pravatar.cc/300?img=12",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 101,
						userId: 101,
						fullName: "Arya Pratama",
						phoneNumber: "081234567801",
						address: "Jl. Melati No. 12, Jakarta Selatan",
						avatarUrl: "https://i.pravatar.cc/300?img=1",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 102,
						userId: 102,
						fullName: "Bella Maharani",
						phoneNumber: "081234567802",
						address: "Jl. Anggrek No. 8, Tangerang Selatan",
						avatarUrl: "https://i.pravatar.cc/300?img=5",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 103,
						userId: 103,
						fullName: "Citra Lestari",
						phoneNumber: "081234567803",
						address: "Jl. Kenanga No. 21, Depok",
						avatarUrl: "https://i.pravatar.cc/300?img=9",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 104,
						userId: 104,
						fullName: "Dimas Saputra",
						phoneNumber: "081234567804",
						address: "Jl. Cemara No. 5, Bekasi",
						avatarUrl: "https://i.pravatar.cc/300?img=14",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 201,
						userId: 201,
						fullName: "Raka Firmansyah",
						phoneNumber: "081345678901",
						address: "Jl. Merdeka No. 17, Jakarta Barat",
						avatarUrl: "https://i.pravatar.cc/300?img=18",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 202,
						userId: 202,
						fullName: "Maya Putri",
						phoneNumber: "081345678902",
						address: "Jl. Mawar No. 30, Jakarta Timur",
						avatarUrl: "https://i.pravatar.cc/300?img=23",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 203,
						userId: 203,
						fullName: "Budi Santoso",
						phoneNumber: "081345678903",
						address: "Jl. Flamboyan No. 4, Bogor",
						avatarUrl: "https://i.pravatar.cc/300?img=31",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 204,
						userId: 204,
						fullName: "Nina Kartika",
						phoneNumber: "081345678904",
						address: "Jl. Dahlia No. 9, Tangerang",
						avatarUrl: "https://i.pravatar.cc/300?img=35",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 205,
						userId: 205,
						fullName: "Eko Wijaya",
						phoneNumber: "081345678905",
						address: "Jl. Cempaka No. 15, Depok",
						avatarUrl: "https://i.pravatar.cc/300?img=48",
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await queryInterface.bulkInsert(
				"SellerProfiles",
				[
					{
						id: 201,
						userProfileId: 201,
						headline: "Jasa kebersihan rumah cepat, rapi, dan terpercaya",
						description:
							"Berpengalaman menangani kebersihan rumah, apartemen, dan kos dengan peralatan lengkap.",
						experienceYear: 4,
						bankName: "BCA",
						bankAccountNumber: "1234567801",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 202,
						userProfileId: 202,
						headline: "Laundry dan setrika pakaian harian dengan hasil bersih",
						description:
							"Melayani laundry kiloan, setrika, dan antar jemput untuk area Jakarta Timur.",
						experienceYear: 3,
						bankName: "Mandiri",
						bankAccountNumber: "1234567802",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 203,
						userProfileId: 203,
						headline: "Teknisi home repair untuk listrik, kran, dan perabot rumah",
						description:
							"Membantu perbaikan ringan di rumah seperti instalasi lampu, kran bocor, dan rak dinding.",
						experienceYear: 6,
						bankName: "BRI",
						bankAccountNumber: "1234567803",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 204,
						userProfileId: 204,
						headline: "Pet care harian untuk kucing dan anjing kesayangan",
						description:
							"Melayani perawatan hewan, feeding, walking, dan basic grooming dengan penuh perhatian.",
						experienceYear: 5,
						bankName: "BNI",
						bankAccountNumber: "1234567804",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 205,
						userProfileId: 205,
						headline: "Tutor privat dan bantuan belajar untuk anak sekolah",
						description:
							"Mengajar matematika dasar, bahasa Inggris, dan pendampingan PR untuk SD sampai SMP.",
						experienceYear: 4,
						bankName: "CIMB Niaga",
						bankAccountNumber: "1234567805",
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await queryInterface.bulkInsert(
				"Items",
				[
					{
						id: 101,
						name: "Cleaning Service",
						description:
							"Layanan bersih-bersih rumah, kamar, apartemen, dan area kerja secara praktis.",
						imageUrl: "https://placehold.co/800x500/png?text=Cleaning+Service",
						status: "active",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 102,
						name: "Laundry",
						description:
							"Layanan cuci, setrika, dan antar jemput pakaian untuk kebutuhan harian.",
						imageUrl: "https://placehold.co/800x500/png?text=Laundry",
						status: "active",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 103,
						name: "Home Repair",
						description:
							"Jasa perbaikan rumah ringan seperti listrik, kran, pintu, dan perabot.",
						imageUrl: "https://placehold.co/800x500/png?text=Home+Repair",
						status: "active",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 104,
						name: "Pet Care",
						description:
							"Layanan perawatan hewan peliharaan mulai dari feeding, walking, sampai grooming dasar.",
						imageUrl: "https://placehold.co/800x500/png?text=Pet+Care",
						status: "active",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 105,
						name: "Massage",
						description:
							"Layanan pijat relaksasi dan refleksi untuk membantu mengurangi pegal dan lelah.",
						imageUrl: "https://placehold.co/800x500/png?text=Massage",
						status: "active",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 106,
						name: "Private Tutor",
						description:
							"Jasa tutor privat untuk pelajaran sekolah, latihan soal, dan pendampingan belajar.",
						imageUrl: "https://placehold.co/800x500/png?text=Private+Tutor",
						status: "active",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 107,
						name: "Gardening",
						description:
							"Jasa merapikan taman, memotong rumput, menyiram tanaman, dan perawatan tanaman kecil.",
						imageUrl: "https://placehold.co/800x500/png?text=Gardening",
						status: "active",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 108,
						name: "Moving Helper",
						description:
							"Jasa bantuan pindahan ringan untuk kos, apartemen, dan rumah kecil.",
						imageUrl: "https://placehold.co/800x500/png?text=Moving+Helper",
						status: "inactive",
						createdById: 100,
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await queryInterface.bulkInsert(
				"SellerItems",
				[
					{
						id: 301,
						sellerProfileId: 201,
						itemId: 101,
						serviceTitle: "Deep Cleaning Rumah 3 Jam",
						serviceDescription:
							"Pembersihan ruang tamu, kamar, dapur, dan kamar mandi dengan alat standar.",
						price: 175000,
						duration: 180,
						location: "Jakarta Barat",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 302,
						sellerProfileId: 201,
						itemId: 101,
						serviceTitle: "Cleaning Apartemen 2 Jam",
						serviceDescription:
							"Cocok untuk studio atau unit kecil, termasuk sapu, pel, dan lap permukaan.",
						price: 120000,
						duration: 120,
						location: "Jakarta Barat",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 303,
						sellerProfileId: 202,
						itemId: 102,
						serviceTitle: "Laundry Kiloan Express",
						serviceDescription:
							"Cuci dan lipat pakaian dengan estimasi pengerjaan 1 sampai 2 hari.",
						price: 45000,
						duration: 1440,
						location: "Jakarta Timur",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 304,
						sellerProfileId: 202,
						itemId: 102,
						serviceTitle: "Setrika Pakaian Harian",
						serviceDescription:
							"Jasa setrika pakaian harian dengan hasil rapi dan wangi.",
						price: 35000,
						duration: 240,
						location: "Jakarta Timur",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 305,
						sellerProfileId: 203,
						itemId: 103,
						serviceTitle: "Perbaikan Kran dan Pipa Bocor",
						serviceDescription:
							"Pengecekan dan perbaikan ringan untuk kran, pipa, dan saluran air rumah.",
						price: 150000,
						duration: 120,
						location: "Bogor",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 306,
						sellerProfileId: 203,
						itemId: 103,
						serviceTitle: "Instalasi Lampu dan Stop Kontak",
						serviceDescription:
							"Instalasi atau penggantian lampu, saklar, dan stop kontak rumah.",
						price: 180000,
						duration: 150,
						location: "Bogor",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 307,
						sellerProfileId: 204,
						itemId: 104,
						serviceTitle: "Pet Sitting Kucing Harian",
						serviceDescription:
							"Memberi makan, membersihkan pasir, dan menemani kucing saat pemilik bepergian.",
						price: 90000,
						duration: 90,
						location: "Tangerang",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 308,
						sellerProfileId: 204,
						itemId: 104,
						serviceTitle: "Dog Walking 60 Menit",
						serviceDescription:
							"Jalan pagi atau sore untuk anjing kecil dan sedang di area sekitar rumah.",
						price: 80000,
						duration: 60,
						location: "Tangerang",
						status: "unavailable",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 309,
						sellerProfileId: 205,
						itemId: 106,
						serviceTitle: "Tutor Matematika SD 90 Menit",
						serviceDescription:
							"Pendampingan belajar matematika dasar, latihan soal, dan pembahasan PR.",
						price: 125000,
						duration: 90,
						location: "Depok",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 310,
						sellerProfileId: 205,
						itemId: 106,
						serviceTitle: "Tutor Bahasa Inggris SMP",
						serviceDescription:
							"Belajar grammar, vocabulary, reading, dan persiapan ulangan sekolah.",
						price: 140000,
						duration: 90,
						location: "Depok",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 311,
						sellerProfileId: 201,
						itemId: 107,
						serviceTitle: "Perawatan Taman Kecil",
						serviceDescription:
							"Merapikan rumput, membersihkan daun kering, dan menyiram tanaman area rumah.",
						price: 135000,
						duration: 120,
						location: "Jakarta Barat",
						status: "available",
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await queryInterface.bulkInsert(
				"Bookings",
				[
					{
						id: 401,
						bookingCode: "TSK-000401",
						buyerId: 101,
						sellerItemId: 301,
						bookingDate: new Date("2026-05-03T09:00:00+07:00"),
						address: "Jl. Melati No. 12, Jakarta Selatan",
						note: "Tolong bawa alat pel sendiri jika memungkinkan.",
						status: "pending",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 402,
						bookingCode: "TSK-000402",
						buyerId: 102,
						sellerItemId: 303,
						bookingDate: new Date("2026-05-04T10:00:00+07:00"),
						address: "Jl. Anggrek No. 8, Tangerang Selatan",
						note: "Laundry pakaian kerja, jangan dicampur dengan handuk.",
						status: "approved",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 403,
						bookingCode: "TSK-000403",
						buyerId: 103,
						sellerItemId: 305,
						bookingDate: new Date("2026-05-05T13:00:00+07:00"),
						address: "Jl. Kenanga No. 21, Depok",
						note: "Kran dapur bocor cukup deras.",
						status: "on_progress",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 404,
						bookingCode: "TSK-000404",
						buyerId: 104,
						sellerItemId: 307,
						bookingDate: new Date("2026-05-06T08:00:00+07:00"),
						address: "Jl. Cemara No. 5, Bekasi",
						note: "Kucing perlu diberi makan pagi dan bersihkan pasir.",
						status: "waiting_payment",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 405,
						bookingCode: "TSK-000405",
						buyerId: 101,
						sellerItemId: 309,
						bookingDate: new Date("2026-05-07T16:00:00+07:00"),
						address: "Jl. Melati No. 12, Jakarta Selatan",
						note: "Fokus latihan pecahan dan perkalian.",
						status: "waiting_payment_confirmation",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 406,
						bookingCode: "TSK-000406",
						buyerId: 102,
						sellerItemId: 306,
						bookingDate: new Date("2026-04-25T11:00:00+07:00"),
						address: "Jl. Anggrek No. 8, Tangerang Selatan",
						note: "Ganti lampu ruang tamu dan cek stop kontak kamar.",
						status: "completed",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 407,
						bookingCode: "TSK-000407",
						buyerId: 103,
						sellerItemId: 302,
						bookingDate: new Date("2026-04-20T14:00:00+07:00"),
						address: "Jl. Kenanga No. 21, Depok",
						note: "Apartemen tipe studio, akses dari lobby utama.",
						status: "completed",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 408,
						bookingCode: "TSK-000408",
						buyerId: 104,
						sellerItemId: 304,
						bookingDate: new Date("2026-04-18T09:30:00+07:00"),
						address: "Jl. Cemara No. 5, Bekasi",
						note: "Setrika baju kerja dan seragam sekolah.",
						status: "cancelled",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 409,
						bookingCode: "TSK-000409",
						buyerId: 101,
						sellerItemId: 310,
						bookingDate: new Date("2026-04-15T17:00:00+07:00"),
						address: "Jl. Melati No. 12, Jakarta Selatan",
						note: "Persiapan ulangan bahasa Inggris minggu depan.",
						status: "rejected",
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 410,
						bookingCode: "TSK-000410",
						buyerId: 102,
						sellerItemId: 311,
						bookingDate: new Date("2026-04-10T07:00:00+07:00"),
						address: "Jl. Anggrek No. 8, Tangerang Selatan",
						note: "Taman kecil di halaman belakang.",
						status: "completed",
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await queryInterface.bulkInsert(
				"Invoices",
				[
					{
						id: 501,
						invoiceNumber: "INV-202605-0001",
						bookingId: 404,
						amount: 90000,
						status: "issued",
						issuedAt: new Date("2026-05-06T10:00:00+07:00"),
						dueDate: new Date("2026-05-09T23:59:00+07:00"),
						issuedBySellerProfileId: 204,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 502,
						invoiceNumber: "INV-202605-0002",
						bookingId: 405,
						amount: 125000,
						status: "issued",
						issuedAt: new Date("2026-05-07T18:00:00+07:00"),
						dueDate: new Date("2026-05-10T23:59:00+07:00"),
						issuedBySellerProfileId: 205,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 503,
						invoiceNumber: "INV-202604-0003",
						bookingId: 406,
						amount: 180000,
						status: "paid",
						issuedAt: new Date("2026-04-25T13:00:00+07:00"),
						dueDate: new Date("2026-04-28T23:59:00+07:00"),
						issuedBySellerProfileId: 203,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 504,
						invoiceNumber: "INV-202604-0004",
						bookingId: 407,
						amount: 120000,
						status: "paid",
						issuedAt: new Date("2026-04-20T16:30:00+07:00"),
						dueDate: new Date("2026-04-23T23:59:00+07:00"),
						issuedBySellerProfileId: 201,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 505,
						invoiceNumber: "INV-202604-0005",
						bookingId: 408,
						amount: 35000,
						status: "cancelled",
						issuedAt: new Date("2026-04-18T12:00:00+07:00"),
						dueDate: new Date("2026-04-21T23:59:00+07:00"),
						issuedBySellerProfileId: 202,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 506,
						invoiceNumber: "INV-202604-0006",
						bookingId: 410,
						amount: 135000,
						status: "paid",
						issuedAt: new Date("2026-04-10T10:30:00+07:00"),
						dueDate: new Date("2026-04-13T23:59:00+07:00"),
						issuedBySellerProfileId: 201,
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await queryInterface.bulkInsert(
				"Payments",
				[
					{
						id: 601,
						invoiceId: 501,
						amount: 90000,
						paymentMethod: "bank_transfer",
						paymentStatus: "unpaid",
						proofPaymentUrl: null,
						paidAt: null,
						confirmedAt: null,
						confirmedBySellerProfileId: null,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 602,
						invoiceId: 502,
						amount: 125000,
						paymentMethod: "e_wallet",
						paymentStatus: "waiting_confirmation",
						proofPaymentUrl:
							"https://placehold.co/800x1200/png?text=Payment+Proof+INV-202605-0002",
						paidAt: new Date("2026-05-07T19:00:00+07:00"),
						confirmedAt: null,
						confirmedBySellerProfileId: null,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 603,
						invoiceId: 503,
						amount: 180000,
						paymentMethod: "bank_transfer",
						paymentStatus: "paid",
						proofPaymentUrl:
							"https://placehold.co/800x1200/png?text=Payment+Proof+INV-202604-0003",
						paidAt: new Date("2026-04-25T15:00:00+07:00"),
						confirmedAt: new Date("2026-04-25T16:00:00+07:00"),
						confirmedBySellerProfileId: 203,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 604,
						invoiceId: 504,
						amount: 120000,
						paymentMethod: "cash",
						paymentStatus: "paid",
						proofPaymentUrl:
							"https://placehold.co/800x1200/png?text=Cash+Payment+Receipt+INV-202604-0004",
						paidAt: new Date("2026-04-20T16:45:00+07:00"),
						confirmedAt: new Date("2026-04-20T17:00:00+07:00"),
						confirmedBySellerProfileId: 201,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 605,
						invoiceId: 505,
						amount: 35000,
						paymentMethod: "bank_transfer",
						paymentStatus: "rejected",
						proofPaymentUrl:
							"https://placehold.co/800x1200/png?text=Rejected+Payment+Proof+INV-202604-0005",
						paidAt: new Date("2026-04-18T13:00:00+07:00"),
						confirmedAt: new Date("2026-04-18T15:00:00+07:00"),
						confirmedBySellerProfileId: 202,
						createdAt: now,
						updatedAt: now,
					},
					{
						id: 606,
						invoiceId: 506,
						amount: 135000,
						paymentMethod: "e_wallet",
						paymentStatus: "paid",
						proofPaymentUrl:
							"https://placehold.co/800x1200/png?text=Payment+Proof+INV-202604-0006",
						paidAt: new Date("2026-04-10T11:00:00+07:00"),
						confirmedAt: new Date("2026-04-10T11:30:00+07:00"),
						confirmedBySellerProfileId: 201,
						createdAt: now,
						updatedAt: now,
					},
				],
				{ transaction },
			);

			await this.resetSequences(queryInterface, transaction);

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	},

	async down(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();

		try {
			await queryInterface.bulkDelete(
				"Payments",
				{
					id: { [Op.in]: [601, 602, 603, 604, 605, 606] },
				},
				{ transaction },
			);

			await queryInterface.bulkDelete(
				"Invoices",
				{
					id: { [Op.in]: [501, 502, 503, 504, 505, 506] },
				},
				{ transaction },
			);

			await queryInterface.bulkDelete(
				"Bookings",
				{
					id: {
						[Op.in]: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410],
					},
				},
				{ transaction },
			);

			await queryInterface.bulkDelete(
				"SellerItems",
				{
					id: {
						[Op.in]: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311],
					},
				},
				{ transaction },
			);

			await queryInterface.bulkDelete(
				"Items",
				{
					id: { [Op.in]: [101, 102, 103, 104, 105, 106, 107, 108] },
				},
				{ transaction },
			);

			await queryInterface.bulkDelete(
				"SellerProfiles",
				{
					id: { [Op.in]: [201, 202, 203, 204, 205] },
				},
				{ transaction },
			);

			await queryInterface.bulkDelete(
				"UserProfiles",
				{
					id: {
						[Op.in]: [100, 101, 102, 103, 104, 201, 202, 203, 204, 205],
					},
				},
				{ transaction },
			);

			await queryInterface.bulkDelete(
				"Users",
				{
					id: {
						[Op.in]: [100, 101, 102, 103, 104, 201, 202, 203, 204, 205],
					},
				},
				{ transaction },
			);

			await this.resetSequences(queryInterface, transaction);

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	},

	async resetSequences(queryInterface, transaction) {
		const tables = [
			"Users",
			"UserProfiles",
			"SellerProfiles",
			"Items",
			"SellerItems",
			"Bookings",
			"Invoices",
			"Payments",
		];

		for (const table of tables) {
			await queryInterface.sequelize.query(
				`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1));`,
				{ transaction },
			);
		}
	},
};
