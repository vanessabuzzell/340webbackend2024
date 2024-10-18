--Add to account
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Update to account
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--Delete from account
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

--Update GMC HUMMER
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = (10);

--Inner Join for Sport car
SELECT inv.inv_make, inv.inv_model, class.classification_name
FROM public.inventory inv
INNER JOIN public.classification class ON inv.classification_id = class.classification_id
WHERE class.classification_name = 'Sport';

--update with adding vehicles and its file path
UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
AND inv_images = REPLACE(inv_images, '/images/', '/images/vehicles/');
