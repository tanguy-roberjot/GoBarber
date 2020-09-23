# Recupereção de senha

**RF**

- O usuario deve poder recuperar sua senha informando o seu e-mail
- O usuario deve receber um email com instruções de recuperação de senha
- O usuario deve poder resetar sua senha

**RNF**

- utilizar MailTrap para testar envio de email em ambiente de desenvolvimento
- utilizar Amazon SES para envio de email em produção
- O envio de email deve acontecer em segundo plano (background job)

**RN**

- O link enviado por email para resetar a senha deve expirar em 2h
- O usuario precisa confirmar a nova senha ao resetar sua senha

# Atualização do perfil

**RF**

- O usuario deve poder atualizar seu nome, email e senha

**RN**

- O usuario não pode alterar seu email para um email já utilizado
- Para atualizar sua senha, o usuario deve informar sua senha antiga
- Para atualizar sua senha, o usuario deve confirmar a nova senha


# Painel do prestador

**RF**

- O prestador deve poder listar seus agendamentos de um dia especifico
- O prestador deve receber uma notificação sempre que houvr um novo agendamento
- O prestador deve poder visualizar as notificações não lidas

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache
- As notificações do prestador devem ser armazenadas no MongoDB
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io


**RN**

- A notificação deve ter um campo lida/não lida para poder controlar

# Agendamento de serviços

**RF**

- O usuario deve poder listar todos os prestadores cadastrados
- O usuario deve poder listar os dias de um mês com pelo menos um horario disponivel de um prestador
- O usuario deve poder listar os horarios disponiveis de um dia especifico de um prestador
- O usuario deve poder agendar numhorario disponivel do prestador

**RNF**

- A listagem de prestadores deve ser armazenada em cache

**RN**

- Cada agendamento deve durar 1h
- Os agendamentos devem ser entre as 8h e as 18h (ultimo as 17h)
- O usuario não pode agendar num horario já ocupado
- O usuario não pode agendar num horario passado
- O usuario não pode agendar serviço consigo mesmo
