/* Insert into account */

INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

/* Update account type to admin */
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

/* Delete account */
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

/* Update Description */
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

/* Select inventory belonging to sport classification */
SELECT inv_make, inv_model, classification_name
FROM public.inventory
JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

/* Update image url on inventory table */
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
