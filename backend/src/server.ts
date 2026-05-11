import Fastify from 'fastify';
import cors from '@fastify/cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from './data-source';
import { User } from './entities/User';
import { Card } from './entities/Card';

const app = Fastify({ logger: true });

app.register(cors, { 
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Adicione o DELETE explicitamente aqui
});

const SECRET_KEY = 'SUA_CHAVE_SECRETA_SUPER_PROTEGIDA';

// --- ROTAS PÚBLICAS ---

app.get('/teste', async () => {
  return { message: 'uTask 3.0 API está online!' };
});

app.post('/usuarios', async (request, reply) => {
  try {
    const { name, email, password } = request.body as any;
    const userRepository = AppDataSource.getRepository(User);
    const userExists = await userRepository.findOneBy({ email });
    if (userExists) return reply.status(400).send({ message: "E-mail em uso." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({ name, email, password: hashedPassword });
    await userRepository.save(newUser);
    return reply.status(201).send({ message: "Usuário criado!" });
  } catch (error) {
    return reply.status(500).send({ message: "Erro ao criar usuário." });
  }
});

app.post('/login', async (request, reply) => {
  try {
    const { email, password } = request.body as any;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });
    if (!user) return reply.status(401).send({ message: "Dados inválidos." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return reply.status(401).send({ message: "Dados inválidos." });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1d' });
    return reply.send({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    return reply.status(500).send({ message: "Erro no login." });
  }
});

// --- ROTAS PRIVADAS (CARDS) ---

// Função auxiliar para verificar o token e pegar o ID do usuário
const getUserIdFromToken = (request: any) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) throw new Error("Token não fornecido.");
  
  
  const token = authHeader.split(' ')[1]; 
  
  const decoded = jwt.verify(token, SECRET_KEY) as any;
  return decoded.id;
};

// 1. Criar Card
app.post('/cards', async (request, reply) => {
  try {
    const userId = getUserIdFromToken(request);
    const { title, content } = request.body as any;
    const cardRepository = AppDataSource.getRepository(Card);

    const newCard = cardRepository.create({
      title,
      content,
      user: { id: userId } // Vincula o card ao usuário logado
    });

    await cardRepository.save(newCard);
    return reply.status(201).send(newCard);
  } catch (error) {
    return reply.status(401).send({ message: "Não autorizado." });
  }
});

// 2. Listar Cards do Usuário
app.get('/cards', async (request, reply) => {
  try {
    const userId = getUserIdFromToken(request);
    const cardRepository = AppDataSource.getRepository(Card);
    
    // Busca apenas os cards onde o userId é igual ao do token
    const cards = await cardRepository.find({
      where: { user: { id: userId } }
    });
    return cards;
  } catch (error) {
    return reply.status(401).send({ message: "Não autorizado." });
  }
});

// 3. Atualizar Card (Mover no Kanban)
app.put('/cards/:id', async (request, reply) => {
  try {
    const userId = getUserIdFromToken(request);
    const { id } = request.params as any;
    const { status, title, content } = request.body as any;
    const cardRepository = AppDataSource.getRepository(Card);

    const card = await cardRepository.findOne({ where: { id, user: { id: userId } } });
    if (!card) return reply.status(404).send({ message: "Card não encontrado." });

    cardRepository.merge(card, { status, title, content });
    await cardRepository.save(card);
    return card;
  } catch (error) {
    return reply.status(401).send({ message: "Erro ao atualizar." });
  }
});

// 4. Deletar Card
app.delete('/cards/:id', async (request, reply) => {
  try {
    const userId = getUserIdFromToken(request);
    const { id } = request.params as any; // Pega o ID da URL
    const cardRepository = AppDataSource.getRepository(Card);

    // Tenta deletar garantindo que o card pertence ao usuário
    const result = await cardRepository.delete({ 
      id: Number(id), // Garantimos que o ID seja um número
      user: { id: userId } 
    });

    if (result.affected === 0) {
      return reply.status(404).send({ message: "Card não encontrado." });
    }

    return reply.status(204).send();
  } catch (error) {
    return reply.status(401).send({ message: "Erro ao deletar." });
  }
});

const start = async () => {
  try {
    await AppDataSource.initialize();
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Backend uTask 3.0 rodando!');
  } catch (err) {
    process.exit(1);
  }
};
start();
