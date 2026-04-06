INSERT IGNORE INTO admin (id, voter_id, password) VALUES (1, 100, 'admin123');

-- Fix party images: update all BJP, INC, AAP, SAD rows
UPDATE political_parties SET political_parties_symbol = 'https://tse2.mm.bing.net/th/id/OIP.53bSgHop7Rw7VMVwi2PU7gHaH6?pid=Api&P=0&h=180',
    parties_candidate_img = 'https://media.assettype.com/sentinelassam-english/2026-01-26/w6nyejdk/Narendra-Modi.webp?w=1200&ar=40:21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100'
    WHERE name = 'BJP';

UPDATE political_parties SET political_parties_symbol = 'https://tse2.mm.bing.net/th/id/OIP.7gBsmyboxHJsRCp6Yf0kpwHaE2?pid=Api&P=0&h=180',
    parties_candidate_img = 'https://tse2.mm.bing.net/th/id/OIP.QJBtpk5ZwqsCSVBS6_S-uQHaEK?pid=Api&P=0&h=180'
    WHERE name = 'INC';

UPDATE political_parties SET political_parties_symbol = 'https://tse3.mm.bing.net/th/id/OIP.WExtSFlcjlLts4SAE9SVcQHaFO?pid=Api&P=0&h=180',
    parties_candidate_img = 'https://d2e1hu1ktur9ur.cloudfront.net/wp-content/uploads/2025/02/Arvind-Kejriwal-4.jpg'
    WHERE name = 'AAP';

UPDATE political_parties SET political_parties_symbol = 'https://tse3.mm.bing.net/th/id/OIP.-zgU1kJkApXOESdrlzBjoAHaE8?pid=Api&P=0&h=180',
    parties_candidate_img = 'https://tse4.mm.bing.net/th/id/OIP.jZycuWr34gEvfXTIMVsmnAHaEc?pid=Api&P=0&h=180'
    WHERE name = 'SAD';
