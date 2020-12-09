INSERT INTO department
  (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Sales Lead', 100000 , 1),
  ('Salesperson', 20000 , 1),
  ('Lead Engineer', 300000, 2),
  ('Software Engineer', 400000, 2),
  ('Accountant', 500000, 3),
  ('Legal Team Lead', 600000, 4),
  ('Lawyer', 700000, 4);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Shirley', 'Mackey', 1, 5),
  ('Stormie', 'Rose', 2, 1),
  ('Zoriahna', 'Cutler', 3, 3),
  ('Lance', 'Junior', 4, 3),
  ('Oreo', 'Cutler', 5, 6),
  ('Lucky', 'Cutler', 6, 1),
  ('Sara', 'Cutler', 7, 2),
  ('Danielle', 'Cutler', 4, 3);