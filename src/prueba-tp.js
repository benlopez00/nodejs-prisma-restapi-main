// Importamos la conexión que ya configuraste con tu adaptador MariaDB en db.js
import { prisma } from "./db.js";

async function main() {
	console.log("Creando datos iniciales...");

	// 1. Crear Categoría y Productos
	const category = await prisma.category.create({
		data: {
			name: "Electrónica",
			products: {
				create: [
					{ name: "Teclado Mecánico", price: 50000, quantity: 10 },
					{ name: "Mouse Gamer", price: 25000, quantity: 15 },
				],
			},
		},
	});

	// 2. Crear Usuario
	const user = await prisma.user.create({
		data: {
			name: "Juan Pérez",
			email: "juan@ejemplo.com",
		},
	});

	// 3. Obtener los IDs de los productos
	const products = await prisma.product.findMany();

	// 4. Crear Orden y OrderItems
	await prisma.order.create({
		data: {
			userId: user.id,
			orderItems: {
				create: [
					{ productId: products[0].id, quantity: 1 },
					{ productId: products[1].id, quantity: 2 },
				],
			},
		},
	});

	console.log("Datos creados exitosamente.\n");
	console.log("Ejecutando consulta obligatoria del TP...");

	// 5. CONSULTA OBLIGATORIA
	const orderData = await prisma.order.findFirst({
		include: {
			user: true,
			orderItems: {
				include: {
					product: {
						include: {
							category: true,
						},
					},
				},
			},
		},
	});

	console.dir(orderData, { depth: null });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
