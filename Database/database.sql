-- Create table 'coin'
CREATE TABLE coin (
    code TEXT PRIMARY KEY,
    description TEXT
);

-- Create table 'type'
CREATE TABLE type (
    code TEXT PRIMARY KEY,
    description TEXT
);

-- Create table 'prices'
CREATE TABLE prices (
    correlative SERIAL PRIMARY KEY,
    price FLOAT,
    coin_code TEXT,
    type_code TEXT,
    FOREIGN KEY (coin_code) REFERENCES coin(code) ON DELETE NO ACTION,
    FOREIGN KEY (type_code) REFERENCES type(code) ON DELETE NO ACTION
);

-- Create table 'car'
CREATE TABLE car (
    correlative SERIAL PRIMARY KEY,
    plate TEXT,
    type_code TEXT UNIQUE NOT NULL,
    FOREIGN KEY (type_code) REFERENCES type(code) ON DELETE NO ACTION
);

-- Create table 'tickets'
CREATE TABLE tickets (
    correlative SERIAL PRIMARY KEY,
    date DATE DEFAULT NOW(),
    entry_date TIMESTAMP DEFAULT NOW(),
    out_date TIMESTAMP,
    car_correlative INTEGER,
    status BOOLEAN DEFAULT false,
    FOREIGN KEY (car_correlative) REFERENCES car(correlative) ON DELETE NO ACTION
);

-- Create table 'tickets_coins'
CREATE TABLE tickets_coins (
    line SERIAL PRIMARY KEY,
    main_correlative INTEGER,
    total FLOAT,
    coin_correlative TEXT,
    FOREIGN KEY (main_correlative) REFERENCES tickets(correlative) ON DELETE cascade,
    FOREIGN KEY (coin_correlative) REFERENCES coin(code) ON DELETE NO ACTION
);

CREATE OR REPLACE FUNCTION tg_insert_coins()
RETURNS TRIGGER AS $$
DECLARE
  su_price RECORD;
BEGIN
  FOR su_price IN
    SELECT * FROM prices WHERE type_code = (SELECT type_code FROM car WHERE correlative = NEW.car_correlative)
  LOOP
    INSERT INTO tickets_coins (main_correlative, total, coin_correlative) VALUES
      (NEW.correlative, su_price.price, su_price.coin_code);
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER after_insert_tickets
AFTER INSERT ON tickets
FOR EACH ROW
EXECUTE procedure tg_insert_coins();
