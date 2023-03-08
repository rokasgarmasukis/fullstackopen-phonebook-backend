const express = require("express");
const morgan = require('morgan')
const cors = require('cors')


const app = express();

app.use(express.json());
app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;

  const person = persons.find((p) => p.id === id);

  if (person) {
    return res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body) {
    return res.json({ error: "content missing" });
  } else if (!body.name) {
    return res.json({ error: "name missing" });
  }

  const id = Math.floor(Math.random() * 10000);

  const { name, number } = body;

  const nameExists = persons.some((p) => p.name === name);
  const numberExists = persons.some((p) => p.number === number);
  if (nameExists) {
    return res.json({ error: "name must be unique" });
  } else if (numberExists) {
    return res.json({ error: "number already exists" });
  }

  const person = {
    id,
    name,
    number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;

  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
