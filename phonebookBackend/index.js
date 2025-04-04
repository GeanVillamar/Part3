const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("tiny"));

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

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.json());
app.use(requestLogger);

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    "<p>Phonebook has info for " +
      persons.length +
      " people</p>" +
      "<p>" +
      new Date() +
      "</p>"
  );
});

//step 3: get a person by id, http://localhost:3001/api/persons/5
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//step 4: delete a person
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  if (persons.find((p) => p.name === person.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  const id = maxId + 1;

  const newPerson = {
    id: id,
    name: person.name,
    number: person.number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
  console.log(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
