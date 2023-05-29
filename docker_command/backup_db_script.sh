#!/bin/bash


BACKUP_DIR="/root/backup_automation"
cd $BACKUP_DIR
DATE=$(date "+%d-%m-%Y_%H-%M")


FILE_BACKUP_DIR="vpngate_$DATE"
mkdir $FILE_BACKUP_DIR
cd $FILE_BACKUP_DIR
docker exec -i -e PGPASSWORD=G1xKWfLXCPg8zKHji1LSK76pDVCdpzqGGStCtbwo7SQXlCN2tmwouIt412HUfTBU0sbJ4DFIizo5JyZbseQ337BiEp9hayjmaeK9 postgres_db /usr/bin/pg_dump \
 -U zvpn -d zvpn_db| gzip -9  >  $FILE_BACKUP_DIR.sql.gz
cd ..
tar -zcvf  $FILE_BACKUP_DIR.tar.gz $FILE_BACKUP_DIR

rm -rf $FILE_BACKUP_DIR

 


HOST='u226283.your-storagebox.de'
USER='u226283'
PASSWD='iDw2IcfOgsSembB5'
FILE="$FILE_BACKUP_DIR.tar.gz"


/usr/bin/ftp -n $HOST <<END_SCRIPT
passive
binary
quote USER $USER
quote PASS $PASSWD
cd vpngate/
put $FILE
quit
END_SCRIPT

rm "$FILE_BACKUP_DIR.tar.gz"


time=`date +%T`
date=`date +%m-%d-%Y`
echo "last backup time : $date - $time" >> /root/backup_automation/backup.log