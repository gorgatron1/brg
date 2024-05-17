#!/bin/zsh


guilds=(
	'exile 656997348'
	'hope 369351434'
	'hoth 478284627'
	'lop oFnRSXMiRIqJL2TbM0LOzw'
	'mandalorians XGSU1h1tQlGTOZxmUCiU8A'
	'twd 855782277'
	'wk wo4KlBV4QueZgNW9ux6aHw'
	'templar 638481212'
	'kotd pBNm9VGERGaGumDTN4MSuA'
	'lazerfaces 552198166'
	'ahsoka 842227845'
	'mandos_periperi w53E_OdzQfmvfbZrbu-1kw'
	'space-dragons 499445554'
	'odor Du3nqDe6QxKmgf9igT51-A'
	'holocron 684712353'
	'youngling 211844511'
	'umbaran 848839342'
	'away 347197687'
	'sandpeople 559593336'
	'happyaccidents 753267475'
	'dsr 144743434'
	'frozenshard 569316171'
	'bolls 663558394'
	'calamity ObLbsNEAR7aAHUTM44vzKA'
	'vaders-wake 623332958'
	'noble 985738122'
	'darkforce 938276726'
	'zeros MN0PCfZbR9CbH9xBVF-QaQ'
	'deathless 762819711'
	'high-council zfBluFnbQHGR8ySBhDc7RA'
	'xscoundrels QqcOMGosSviQ0XVoGW_NOg'
	'fallen ZaPWQdcaQLOd8UhMLUC4Xg'
	'druida Iq-gT2_XQs6MZoN_TdKpkA'
	'guardians 1EI79PZSSgSp2CfI-TstCA'
	'strike vFo_cdIHQpSvduy1TIJu9w'
	'vrogus VIFpvHugQdqw20xI9cytww'
	'doomed if_CgDOeQgGBxACsqn852A'
	'korpisoturit uBkkCfIwRAG5LXdcuC_9qQ'
)

# prime the pipe -- fetch the first guild
echo "==============="
echo "FETCH: $guilds[1]"
args=("${(@s/ /)guilds[1]}")

echo "~/bin/swgoh-tool fetch --id $args[2] --guild $args[1].json"
time ~/bin/swgoh-tool fetch --id $args[2] --guild $args[1].json || exit 1


for ((i = 1; i < $#guilds; i++)) ; do 
	args=("${(@s/ /)guilds[i]}")
	
	# now build the guild we just fetched
	echo "~/bin/swgoh-tool site-guild --brg --guild $args[1].json --output docs"
	time ~/bin/swgoh-tool site-guild --brg --guild $args[1].json --output docs &
	
	# and fetch the next one
	
	echo "==============="
	args=("${(@s/ /)guilds[i + 1]}")
	echo "FETCH: $args"

	echo "~/bin/swgoh-tool fetch --id $args[2] --guild $args[1].json"
	time ~/bin/swgoh-tool fetch --id $args[2] --guild $args[1].json || exit 1
	
	# wait for both to complete
	wait
	
done

# finish the pipeline
args=("${(@s/ /)guilds[$#guilds]}")
echo "~/bin/swgoh-tool site-guild --brg --guild $args[1].json --output docs"
time ~/bin/swgoh-tool site-guild --brg --guild $args[1].json --output docs &

echo "==============="
echo "ALLIANCE"

time ~/bin/swgoh-tool site-alliance --brg --output docs --guilds *.json

wait

ret=$?; times; exit "$ret"
