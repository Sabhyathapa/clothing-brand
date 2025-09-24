-- Fix swapped images for Classic White T-Shirt and Slim Fit Jeans
-- Update to use original photos instead of Unsplash

UPDATE products 
SET images = ARRAY['https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTahCboOUCXdJ1KhebtxZYAFmRXyaGwZEqZab0rXJnRRqF5lFFcAjLFInYEtet_JlcQMJX_8CtBzjojRGbIpGaMnKpxhVfNlux-vUYwYgdVuk0vTZ-xsSRXjeM9']
WHERE name = 'Classic White T-Shirt';

UPDATE products 
SET images = ARRAY['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR5E47qNGf3blLIdzwSSk_cus4HXgJEN4o9TuUoAD20chHjU0ueru-3ZvbAEuwB7jli7iYWIy2wr9WlZHTxEA1ag_Dt0440sMZE1PP9veMSKNbvfveAOAbCFw']
WHERE name = 'Slim Fit Jeans';
